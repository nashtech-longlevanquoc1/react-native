package com.shoppingreactnativeapp.room.dao

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import com.shoppingreactnativeapp.room.entity.CatalogEntity

@Dao
interface CatalogDao {

    @Insert(onConflict = OnConflictStrategy.IGNORE)
    suspend fun insertAll(items: List<CatalogEntity>)

    @Query("SELECT * FROM catalog_items")
    suspend fun getAll(): List<CatalogEntity>
}
