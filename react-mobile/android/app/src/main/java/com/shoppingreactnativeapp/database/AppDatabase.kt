package com.shoppingreactnativeapp.core.database

import com.shoppingreactnativeapp.feature.product.data.local.dao.CatalogDao
import com.shoppingreactnativeapp.feature.product.data.local.dao.ProductDao
import com.shoppingreactnativeapp.feature.product.data.local.entity.CatalogEntity
import com.shoppingreactnativeapp.feature.product.data.local.entity.ProductEntity

import android.content.Context
import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase

@Database(
    entities = [ProductEntity::class, CatalogEntity::class],
    version = 3,
    exportSchema = false,
)
abstract class AppDatabase : RoomDatabase() {

    abstract fun productDao(): ProductDao
    abstract fun catalogDao(): CatalogDao

    companion object {
        @Volatile
        private var instance: AppDatabase? = null

        fun getInstance(context: Context): AppDatabase =
            instance ?: synchronized(this) {
                instance ?: buildDatabase(context).also { instance = it }
            }

        private fun buildDatabase(context: Context): AppDatabase =
            Room.databaseBuilder(
                context.applicationContext,
                AppDatabase::class.java,
                "product_list_db",
            )
                .createFromAsset("database/shopping.db")
                .fallbackToDestructiveMigration()
                .build()
    }
}
