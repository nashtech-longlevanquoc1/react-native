package com.shoppingreactnativeapp.feature.product.data.local.dao

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import com.shoppingreactnativeapp.feature.product.data.local.entity.CatalogEntity

@Dao
interface CatalogDao {

    @Insert(onConflict = OnConflictStrategy.IGNORE)
    suspend fun insertAll(items: List<CatalogEntity>)

    @Query("SELECT * FROM catalog_items")
    suspend fun getAll(): List<CatalogEntity>
}
