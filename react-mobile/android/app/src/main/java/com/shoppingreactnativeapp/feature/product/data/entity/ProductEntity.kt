package com.shoppingreactnativeapp.feature.product.data.local.entity

import androidx.room.Entity
import androidx.room.Index
import androidx.room.PrimaryKey

@Entity(
    tableName = "product_items",
    indices = [Index(value = ["productId"], unique = true)]
)
data class ProductEntity(
    @PrimaryKey(autoGenerate = true)
    val id: Long = 0,

    val productId: String,
    val productName: String,
    val price: Double,
    val imageUrl: String? = null,
    val createdAt: Long = System.currentTimeMillis()
)
