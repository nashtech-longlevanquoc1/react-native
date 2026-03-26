package com.shoppingreactnativeapp.data

import kotlinx.coroutines.flow.Flow

class ProductListRepository(
    private val productListDao: ProductListDao
) {
    fun getProductList(): Flow<List<ProductListItem>> = productListDao.getAll()

    suspend fun addToProductList(item: ProductListItem) {
        productListDao.insert(item)
    }

    suspend fun removeFromProductList(productId: String) {
        productListDao.deleteByProductId(productId)
    }

    suspend fun isInProductList(productId: String): Boolean {
        return productListDao.exists(productId)
    }
}
