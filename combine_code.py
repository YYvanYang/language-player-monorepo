#!/usr/bin/env python3
import os
import fnmatch
import argparse
import subprocess
from typing import List, Optional, Dict, Set

# 文件扩展名到 Markdown 语言标识符的映射
EXTENSION_MAP = {
    '.py': 'python',
    '.js': 'javascript',
    '.ts': 'typescript',
    '.jsx': 'jsx',
    '.tsx': 'tsx',
    '.java': 'java',
    '.c': 'c',
    '.cpp': 'cpp',
    '.cs': 'csharp',
    '.go': 'go',
    '.rb': 'ruby',
    '.php': 'php',
    '.html': 'html',
    '.css': 'css',
    '.scss': 'scss',
    '.sass': 'sass',
    '.less': 'less',
    '.sql': 'sql',
    '.sh': 'bash',
    '.bash': 'bash',
    '.zsh': 'bash',
    '.yaml': 'yaml',
    '.yml': 'yaml',
    '.json': 'json',
    '.xml': 'xml',
    '.kt': 'kotlin',
    '.swift': 'swift',
    '.rs': 'rust',
    '.dart': 'dart',
    '.lua': 'lua',
    '.r': 'r',
    '.scala': 'scala',
    '.pl': 'perl',
    '.h': 'cpp',
    '.hpp': 'cpp',
    '.conf': 'ini',
    '.ini': 'ini',
    '.toml': 'toml',
    '.md': 'markdown',
    '.vue': 'vue',
    '.svelte': 'svelte',
}

# 默认排除的模式
DEFAULT_EXCLUDES = [
    '*.md',
    '*.git*',
    '*.log',
    '*.jpg', '*.jpeg', '*.png', '*.gif', '*.webp', '*.svg', '*.bmp', '*.ico',  # 图片文件
    '*.pdf', '*.doc', '*.docx', '*.xls', '*.xlsx', '*.ppt', '*.pptx',  # 文档文件
    '*.zip', '*.tar', '*.gz', '*.rar', '*.7z',  # 压缩文件
    '*.mp3', '*.mp4', '*.avi', '*.mov', '*.wav', '*.ogg',  # 媒体文件
    '*.ttf', '*.otf', '*.woff', '*.woff2', '*.eot',  # 字体文件
    '*.bin', '*.dat', '*.so', '*.dll', '*.exe',  # 二进制文件
    'node_modules/*',
    'venv/*',
    '.venv/*',
    '__pycache__/*',
    'dist/*',
    'build/*',
    '.next/*',
    'out/*',
    '.vscode/*',
    '.idea/*',
    "pnpm-lock.yaml",
    "tailwindcss-v4-reference.css",
]

def is_git_repo() -> bool:
    """检查当前目录是否是 Git 仓库"""
    try:
        subprocess.run(
            ['git', 'rev-parse', '--is-inside-work-tree'],
            capture_output=True, check=True
        )
        return True
    except (subprocess.CalledProcessError, FileNotFoundError):
        return False

def get_tracked_files() -> Optional[List[str]]:
    """获取 Git 跟踪的所有文件列表"""
    try:
        result = subprocess.run(
            ['git', 'ls-files', '--cached', '--exclude-standard'],
            capture_output=True, text=True, check=True, encoding='utf-8'
        )
        return result.stdout.splitlines()
    except (subprocess.CalledProcessError, FileNotFoundError):
        return None

def should_exclude_dir(dirpath: str, dirname: str, exclude_patterns: List[str]) -> bool:
    """检查目录是否应该被排除"""
    full_path = os.path.join(dirpath, dirname)
    
    # 排除隐藏目录（以点开头）
    if dirname.startswith('.'):
        return True
        
    for pattern in exclude_patterns:
        # 匹配目录名本身
        if fnmatch.fnmatch(dirname, pattern.rstrip('/*')):
            return True
            
        # 匹配完整路径
        if fnmatch.fnmatch(full_path, pattern):
            return True
            
        # 匹配目录通配符 (如 node_modules/*)
        if pattern.endswith('/*') and fnmatch.fnmatch(full_path, pattern[:-2]):
            return True
    
    return False

def get_files_by_walking(root_dir: str, exclude_patterns: List[str]) -> List[str]:
    """通过遍历文件系统获取文件列表，支持排除模式"""
    files_list = []
    
    for dirpath, dirnames, filenames in os.walk(root_dir, topdown=True):
        # 过滤排除的目录（修复排除逻辑）
        dirnames[:] = [d for d in dirnames if not should_exclude_dir(dirpath, d, exclude_patterns)]
        
        for filename in filenames:
            file_path = os.path.join(dirpath, filename)
            rel_path = os.path.relpath(file_path, root_dir)
            
            # 检查文件是否应被排除
            if not any(fnmatch.fnmatch(rel_path, pattern) for pattern in exclude_patterns):
                files_list.append(rel_path)
    
    return files_list

def get_language_identifier(filename: str) -> str:
    """根据文件扩展名获取 Markdown 语言标识符"""
    _, ext = os.path.splitext(filename)
    return EXTENSION_MAP.get(ext.lower(), '')  # 如果找不到映射，则返回空字符串

def should_exclude(filename: str, exclude_patterns: List[str]) -> bool:
    """检查文件是否匹配任何排除模式"""
    for pattern in exclude_patterns:
        if fnmatch.fnmatch(filename, pattern):
            return True
    return False

def is_binary_file(filepath: str) -> bool:
    """检查文件是否是二进制文件"""
    # 检查文件扩展名
    _, ext = os.path.splitext(filepath)
    if ext.lower() in {'.jpg', '.jpeg', '.png', '.gif', '.webp', '.pdf', 
                      '.exe', '.dll', '.so', '.pyc', '.zip', '.tar', '.gz'}:
        return True
        
    # 尝试读取文件开头的字节来检测二进制内容
    try:
        with open(filepath, 'rb') as f:
            chunk = f.read(1024)
            return b'\0' in chunk  # 如果包含空字节，通常是二进制文件
    except Exception:
        # 如果无法打开文件，出于安全考虑将其视为二进制
        return True

def combine_code_to_markdown(
    output_filename: str = "project_code.md", 
    exclude_list: Optional[List[str]] = None,
    use_git: bool = True,
    root_dir: str = ".",
    verbose: bool = False,
    max_lines: Optional[int] = None
) -> None:
    """将符合条件的文件合并到 Markdown 文件中"""
    if exclude_list is None:
        exclude_list = DEFAULT_EXCLUDES.copy()
    
    # 始终排除输出文件
    if output_filename not in exclude_list:
        exclude_list.append(output_filename)
        exclude_list.append(f"*/{output_filename}")  # 防止在子目录中有同名文件
    
    if verbose:
        print(f"排除模式: {exclude_list}")
    
    if use_git and is_git_repo():
        if verbose:
            print("使用 Git 获取文件列表...")
        files = get_tracked_files()
        if not files:
            print("未找到 Git 跟踪的文件或无法执行 Git 命令。")
            return
    else:
        if verbose and use_git:
            print("未找到 Git 仓库，使用文件系统遍历...")
        files = get_files_by_walking(root_dir, exclude_list)
    
    # 对文件列表进行进一步过滤，排除二进制文件
    filtered_files = []
    skipped_binaries = []
    
    for filename in files:
        full_path = os.path.join(root_dir, filename)
        
        if not os.path.exists(full_path) or not os.path.isfile(full_path):
            if verbose:
                print(f"跳过不存在或非文件: {filename}")
            continue
            
        if is_binary_file(full_path):
            skipped_binaries.append(filename)
            if verbose:
                print(f"跳过二进制文件: {filename}")
            continue
            
        if not any(fnmatch.fnmatch(filename, pattern) for pattern in exclude_list):
            filtered_files.append(filename)
        elif verbose:
            print(f"排除: {filename}")
    
    if not filtered_files:
        print("过滤后没有文件可以处理。")
        return
    
    if verbose and skipped_binaries:
        print(f"跳过了 {len(skipped_binaries)} 个二进制文件。")
    
    # 排序文件列表以确保一致性
    filtered_files.sort()
    
    if verbose:
        print(f"处理 {len(filtered_files)} 个文件，写入到 {output_filename}...")
    
    project_name = os.path.basename(os.path.abspath(root_dir))
    
    try:
        with open(output_filename, 'w', encoding='utf-8') as outfile:
            # 添加标题和简介
            outfile.write(f"# {project_name} 代码库\n\n")
            outfile.write("*通过 combine_code.py 自动生成*\n\n")
            outfile.write("## 目录\n\n")
            
            # 生成目录
            for filename in filtered_files:
                outfile.write(f"- [{filename}](#{filename.replace('/', '-').replace('.', '-')})\n")
            
            outfile.write("\n---\n\n")
            
            # 写入文件内容
            for filename in filtered_files:
                if verbose:
                    print(f"处理: {filename}")
                
                file_path = os.path.join(root_dir, filename)
                
                # 为每个文件创建锚点兼容的标题
                outfile.write(f"## `{filename}`\n\n")
                
                # 获取语言标识符并写入代码块
                lang = get_language_identifier(filename)
                outfile.write(f"```{lang}\n")
                
                try:
                    # 逐行读取文件以处理大文件
                    with open(file_path, 'r', encoding='utf-8', errors='ignore') as infile:
                        if max_lines is not None:
                            # 如果设置了最大行数限制
                            for i, line in enumerate(infile):
                                if i >= max_lines:
                                    outfile.write(f"\n... (已截断，显示了 {max_lines} 行中的前 {max_lines} 行) ...\n")
                                    break
                                outfile.write(line)
                        else:
                            # 无行数限制，直接逐行复制
                            for line in infile:
                                outfile.write(line)
                except Exception as e:
                    error_msg = f"\n[读取文件时出错: {e}]\n"
                    outfile.write(error_msg)
                    if verbose:
                        print(f"错误: 无法读取文件 {filename}: {e}")
                
                outfile.write("```\n\n")
                outfile.write("---\n\n")
        
        print(f"✅ 成功将代码合并到 {output_filename}")
        
    except IOError as e:
        print(f"❌ 写入输出文件 {output_filename} 时出错: {e}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="将代码文件合并到单个 Markdown 文件中，支持 Git 跟踪的文件或文件系统遍历。",
        formatter_class=argparse.ArgumentDefaultsHelpFormatter
    )
    
    parser.add_argument(
        "-o", "--output",
        default="project_code.md",
        help="输出的 Markdown 文件名"
    )
    
    parser.add_argument(
        "-e", "--exclude",
        action='append',
        help="要排除的 glob 模式（可多次使用）"
    )
    
    parser.add_argument(
        "--no-git",
        action='store_true',
        help="不使用 Git，始终使用文件系统遍历"
    )
    
    parser.add_argument(
        "-d", "--directory",
        default=".",
        help="要处理的项目根目录（当不使用 Git 时）"
    )
    
    parser.add_argument(
        "-v", "--verbose",
        action='store_true',
        help="显示详细处理信息"
    )
    
    parser.add_argument(
        "--max-lines",
        type=int,
        help="每个文件的最大行数（超过将被截断）"
    )
    
    args = parser.parse_args()
    
    # 如果用户提供了排除列表，使用它，否则使用默认列表
    exclusions = args.exclude if args.exclude else DEFAULT_EXCLUDES.copy()
    
    combine_code_to_markdown(
        output_filename=args.output,
        exclude_list=exclusions,
        use_git=not args.no_git,
        root_dir=args.directory,
        verbose=args.verbose,
        max_lines=args.max_lines
    )