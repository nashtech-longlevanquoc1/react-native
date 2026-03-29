package com.shoppingreactnativeapp.feature.product.data.dao

import android.content.Context
import androidx.room.Room
import androidx.test.core.app.ApplicationProvider
import androidx.test.ext.junit.runners.AndroidJUnit4
import com.shoppingreactnativeapp.core.database.AppDatabase
import com.shoppingreactnativeapp.feature.product.data.local.dao.ProductDao
import com.shoppingreactnativeapp.feature.product.data.local.entity.ProductEntity
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.test.runTest
import org.junit.After
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Before
import org.junit.Test
import org.junit.runner.RunWith

@RunWith(AndroidJUnit4::class)
class ProductDaoTest {

    private lateinit var db: AppDatabase
    private lateinit var dao: ProductDao

    @Before
    fun setUp() {
        val context = ApplicationProvider.getApplicationContext<Context>()
        db = Room.inMemoryDatabaseBuilder(context, AppDatabase::class.java)
            .allowMainThreadQueries()
            .build()
        dao = db.productDao()
    }

    @After
    fun tearDown() {
        db.close()
    }

    // ─── insert + getAll ──────────────────────────────────────────────────────

    @Test
    fun insertSingleItem_getAll_returnsItem() = runTest {
        val item = ProductEntity(productId = "P001", productName = "Headphones", price = 129.0)

        dao.insert(item)
        val result = dao.getAll().first()

        assertEquals(1, result.size)
        assertEquals("P001", result[0].productId)
        assertEquals("Headphones", result[0].productName)
        assertEquals(129.0, result[0].price, 0.0)
    }

    @Test
    fun insertMultipleItems_getAll_returnsAllOrderedByCreatedAtDesc() = runTest {
        val item1 = ProductEntity(productId = "P001", productName = "Headphones", price = 129.0, createdAt = 1000L)
        val item2 = ProductEntity(productId = "P002", productName = "Watch", price = 199.0, createdAt = 2000L)

        dao.insert(item1)
        dao.insert(item2)
        val result = dao.getAll().first()

        assertEquals(2, result.size)
        // ORDER BY createdAt DESC → item2 first
        assertEquals("P002", result[0].productId)
        assertEquals("P001", result[1].productId)
    }

    @Test
    fun insertDuplicate_replacesExistingItem() = runTest {
        val original = ProductEntity(productId = "P001", productName = "Headphones", price = 129.0)
        val updated  = ProductEntity(productId = "P001", productName = "Headphones Pro", price = 149.0)

        dao.insert(original)
        dao.insert(updated)
        val result = dao.getAll().first()

        assertEquals(1, result.size)
        assertEquals("Headphones Pro", result[0].productName)
        assertEquals(149.0, result[0].price, 0.0)
    }

    // ─── deleteByProductId ────────────────────────────────────────────────────

    @Test
    fun deleteByProductId_removesCorrectItem() = runTest {
        dao.insert(ProductEntity(productId = "P001", productName = "Headphones", price = 129.0))
        dao.insert(ProductEntity(productId = "P002", productName = "Watch", price = 199.0))

        dao.deleteByProductId("P001")
        val result = dao.getAll().first()

        assertEquals(1, result.size)
        assertEquals("P002", result[0].productId)
    }

    @Test
    fun deleteByProductId_nonExistent_doesNothing() = runTest {
        dao.insert(ProductEntity(productId = "P001", productName = "Headphones", price = 129.0))

        dao.deleteByProductId("P999")
        val result = dao.getAll().first()

        assertEquals(1, result.size)
    }

    // ─── exists ───────────────────────────────────────────────────────────────

    @Test
    fun exists_returnsTrueWhenItemInserted() = runTest {
        dao.insert(ProductEntity(productId = "P001", productName = "Headphones", price = 129.0))

        assertTrue(dao.exists("P001"))
    }

    @Test
    fun exists_returnsFalseWhenItemNotInserted() = runTest {
        assertFalse(dao.exists("P999"))
    }

    @Test
    fun exists_returnsFalseAfterItemDeleted() = runTest {
        dao.insert(ProductEntity(productId = "P001", productName = "Headphones", price = 129.0))
        dao.deleteByProductId("P001")

        assertFalse(dao.exists("P001"))
    }

    // ─── clearAll ─────────────────────────────────────────────────────────────

    @Test
    fun clearAll_removesAllItems() = runTest {
        dao.insert(ProductEntity(productId = "P001", productName = "Headphones", price = 129.0))
        dao.insert(ProductEntity(productId = "P002", productName = "Watch", price = 199.0))

        dao.clearAll()
        val result = dao.getAll().first()

        assertTrue(result.isEmpty())
    }
}
