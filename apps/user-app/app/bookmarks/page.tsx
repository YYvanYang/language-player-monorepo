'use client';

import React from 'react';
import { useAuth } from '../../../libs/auth/contexts/AuthContext'; // 路径可能需要根据实际项目结构调整
import { useBookmarks } from '../../hooks/useBookmarks'; // 路径可能需要根据实际项目结构调整
import { BookmarkList } from '../../_components/bookmark/BookmarkList'; // 路径可能需要根据实际项目结构调整
import { Pagination } from '../../_components/shared/Pagination'; // 路径可能需要根据实际项目结构调整
import { LoadingSpinner } from '../../_components/shared/LoadingSpinner'; // 路径可能需要根据实际项目结构调整

export default function BookmarksPage() {
  const { userId } = useAuth();
  const {
    data: bookmarks, // 假设 useBookmarks 返回的数据结构包含 data 字段
    isLoading,
    page, // 当前页码
    totalPages, // 总页数
    setPage, // 设置页码的函数
  } = useBookmarks({ userId: userId ?? undefined, limit: 10 }); // 传递 userId，如果存在的话。添加分页参数 limit

  // 如果用户未登录，可以显示提示信息或重定向
  if (!userId && !isLoading) {
    // 在加载完成且 userId 不存在时显示
    return (
      <div className="container mx-auto p-4 text-center">
        请先<a href="/login" className="text-blue-600 hover:underline">登录</a>以查看书签。
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">我的书签</h1>
      {isLoading && !bookmarks ? ( // 初始加载时显示 Spinner
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner />
        </div>
      ) : bookmarks && bookmarks.length > 0 ? (
        <>
          <BookmarkList bookmarks={bookmarks} />
          {totalPages > 1 && (
            <div className="mt-6 flex justify-center">
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            </div>
          )}
        </>
      ) : (
        <div className="text-center text-gray-500 mt-10">您还没有添加任何书签。</div>
      )}
    </div>
  );
} 