import subprocess
import os
import fnmatch
import argparse

DEFAULT_EXCLUDES = [
    '*.md',
    'pnpm-lock.yaml',
    'pnpm-workspace.yaml',
    'project_code.md', # Exclude the output file itself
    'combine_code.py', # Exclude the script itself
    '.git/*',         # Exclude files within .git directory explicitly if ls-files somehow includes them
    'node_modules/*', # Common exclusion
    'dist/*',         # Common exclusion
    'build/*',        # Common exclusion
]

def get_tracked_files():
    """获取 Git 跟踪的所有文件列表"""
    try:
        # Using --cached to ensure we only get tracked files
        # --exclude-standard handles standard git ignores (.gitignore, .git/info/exclude)
        result = subprocess.run(
            ['git', 'ls-files', '--cached', '--exclude-standard'],
            capture_output=True, text=True, check=True, encoding='utf-8'
        )
        return result.stdout.splitlines()
    except subprocess.CalledProcessError as e:
        print(f"Error running git ls-files: {e}")
        return None # Return None to indicate failure
    except FileNotFoundError:
        print("Error: 'git' command not found. Make sure Git is installed and in your PATH.")
        return None

def get_file_extension(filename):
    """获取文件扩展名作为语言标识符"""
    _, ext = os.path.splitext(filename)
    return ext[1:] if ext else 'text'

def should_exclude(filename, exclude_patterns):
    """检查文件是否匹配任何排除模式"""
    for pattern in exclude_patterns:
        if fnmatch.fnmatch(filename, pattern):
            return True
    return False

def combine_code_to_markdown(output_filename="frontend_project_code.md", exclude_list=None):
    """将符合条件的文件合并到 Markdown 文件中"""
    if exclude_list is None:
        exclude_list = DEFAULT_EXCLUDES

    print("Fetching tracked files...")
    tracked_files = get_tracked_files()

    if tracked_files is None:
        print("Failed to get tracked files. Aborting.")
        return # Stop execution if git ls-files failed

    if not tracked_files:
        print("No tracked files found.")
        return

    # Filter files *before* opening the output file
    files_to_include = []
    print(f"Applying exclusions: {exclude_list}")
    for filename in tracked_files:
        if not should_exclude(filename, exclude_list):
            files_to_include.append(filename)
        else:
            print(f"Excluding: {filename}")


    if not files_to_include:
        print("No files left to include after exclusions.")
        return

    print(f"\nWriting {len(files_to_include)} files to {output_filename}...")
    try:
        with open(output_filename, 'w', encoding='utf-8') as outfile:
            for filename in files_to_include:
                 # Double-check existence right before reading
                if not os.path.exists(filename) or not os.path.isfile(filename):
                    print(f"Skipping non-existent or non-file: {filename}")
                    continue

                print(f"Processing: {filename}")
                lang = get_file_extension(filename)
                outfile.write(f"## `{filename}`\n\n")
                outfile.write(f"```{lang}\n")
                try:
                    with open(filename, 'r', encoding='utf-8', errors='ignore') as infile:
                        # Read line by line to potentially handle very large files better
                        for line in infile:
                             outfile.write(line)
                        # Ensure a newline before the closing backticks if file was empty or didn't end with one
                        outfile.seek(outfile.tell() - 1, os.SEEK_SET)
                        if outfile.read(1) != '\n':
                            outfile.write('\n')

                except Exception as e:
                    outfile.write(f"\n[Error reading file: {e}]\n") # Make error noticeable
                outfile.write("```\n\n")
                outfile.write("---\n\n")
        print(f"Successfully combined code into {output_filename}")
    except IOError as e:
        print(f"Error writing to output file {output_filename}: {e}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Combine tracked code files into a single Markdown file.")
    parser.add_argument(
        "-o", "--output",
        default="project_code.md",
        help="Output Markdown file name (default: project_code.md)"
    )
    parser.add_argument(
        "-e", "--exclude",
        action='append', # Allows specifying -e multiple times
        help=f"Glob pattern to exclude (can be used multiple times). Defaults: {DEFAULT_EXCLUDES}"
    )

    args = parser.parse_args()

    # If user provided exclusions, use them. Otherwise, use defaults.
    current_exclusions = args.exclude if args.exclude else DEFAULT_EXCLUDES
    # Always exclude the output file dynamically
    if args.output not in current_exclusions:
         current_exclusions.append(args.output)


    combine_code_to_markdown(output_filename=args.output, exclude_list=current_exclusions) 