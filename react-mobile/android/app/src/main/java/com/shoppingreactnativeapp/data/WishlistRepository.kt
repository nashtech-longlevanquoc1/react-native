package com.shoppingreactnativeapp.data

import kotlinx.coroutines.flow.Flow

class WishlistRepository(
    private val wishlistDao: WishlistDao
) {
    fun getWishlist(): Flow<List<WishlistItem>> = wishlistDao.getAll()

    suspend fun addToWishlist(item: WishlistItem) {
        wishlistDao.insert(item)
    }

    suspend fun removeFromWishlist(productId: String) {
        wishlistDao.deleteByProductId(productId)
    }

    suspend fun isInWishlist(productId: String): Boolean {
        return wishlistDao.exists(productId)
    }
}
