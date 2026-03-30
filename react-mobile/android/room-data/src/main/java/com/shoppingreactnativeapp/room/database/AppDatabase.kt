package com.shoppingreactnativeapp.room.database

import com.shoppingreactnativeapp.room.dao.CatalogDao
import com.shoppingreactnativeapp.room.dao.ProductDao
import com.shoppingreactnativeapp.room.entity.CatalogEntity
import com.shoppingreactnativeapp.room.entity.ProductEntity

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
