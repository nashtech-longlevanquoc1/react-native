package com.shoppingreactnativeapp.room.dao

import com.shoppingreactnativeapp.room.entity.ProductEntity

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import kotlinx.coroutines.flow.Flow

@Dao
interface ProductDao {

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insert(item: ProductEntity)

    @Query("SELECT * FROM product_items ORDER BY createdAt DESC")
    fun getAll(): Flow<List<ProductEntity>>

    @Query("DELETE FROM product_items WHERE productId = :productId")
    suspend fun deleteByProductId(productId: String)

    @Query("SELECT EXISTS(SELECT 1 FROM product_items WHERE productId = :productId)")
    suspend fun exists(productId: String): Boolean

    @Query("DELETE FROM product_items")
    suspend fun clearAll()
}
