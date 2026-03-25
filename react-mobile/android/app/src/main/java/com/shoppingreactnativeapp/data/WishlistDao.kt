package com.shoppingreactnativeapp.data

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import kotlinx.coroutines.flow.Flow

@Dao
interface WishlistDao {

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insert(item: WishlistItem)

    @Query("SELECT * FROM product_items ORDER BY createdAt DESC")
    fun getAll(): Flow<List<WishlistItem>>

    @Query("DELETE FROM product_items WHERE productId = :productId")
    suspend fun deleteByProductId(productId: String)

    @Query("SELECT EXISTS(SELECT 1 FROM product_items WHERE productId = :productId)")
    suspend fun exists(productId: String): Boolean

    @Query("DELETE FROM product_items")
    suspend fun clearAll()
}
