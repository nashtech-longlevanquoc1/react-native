package com.shoppingreactnativeapp.feature.product.data.local.entity

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "catalog_items")
data class CatalogEntity(
    @PrimaryKey
    val id: String,
    val name: String,
    val category: String,
    val price: Double,
    val salePrice: Double,
    val sale: Boolean,
    val bg: String,
    val image: String
)
