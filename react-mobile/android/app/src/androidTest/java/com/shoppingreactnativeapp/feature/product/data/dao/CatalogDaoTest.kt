package com.shoppingreactnativeapp.feature.product.data.dao

import android.content.Context
import androidx.room.Room
import androidx.test.core.app.ApplicationProvider
import androidx.test.ext.junit.runners.AndroidJUnit4
import com.shoppingreactnativeapp.core.database.AppDatabase
import com.shoppingreactnativeapp.feature.product.data.local.dao.CatalogDao
import com.shoppingreactnativeapp.feature.product.data.local.entity.CatalogEntity
import kotlinx.coroutines.test.runTest
import org.junit.After
import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Before
import org.junit.Test
import org.junit.runner.RunWith

@RunWith(AndroidJUnit4::class)
class CatalogDaoTest {

    private lateinit var db: AppDatabase
    private lateinit var dao: CatalogDao

    private val sampleItems = listOf(
        CatalogEntity("1", "Headphones",  "Electronics", 129.0, 0.0,  false, "#D8EDE3", "https://example.com/img1.jpg"),
        CatalogEntity("2", "Smart Watch", "Electronics", 199.0, 249.0, true,  "#D8E8ED", "https://example.com/img2.jpg"),
        CatalogEntity("3", "Leather Bag", "Fashion",      99.0,  0.0,  false, "#EDE8D8", "https://example.com/img3.jpg"),
    )

    @Before
    fun setUp() {
        val context = ApplicationProvider.getApplicationContext<Context>()
        db = Room.inMemoryDatabaseBuilder(context, AppDatabase::class.java)
            .allowMainThreadQueries()
            .build()
        dao = db.catalogDao()
    }

    @After
    fun tearDown() {
        db.close()
    }

    // ─── insertAll + getAll ───────────────────────────────────────────────────

    @Test
    fun insertAll_getAll_returnsAllItems() = runTest {
        dao.insertAll(sampleItems)
        val result = dao.getAll()

        assertEquals(sampleItems.size, result.size)
    }

    @Test
    fun insertAll_getAll_returnsCorrectData() = runTest {
        dao.insertAll(sampleItems)
        val result = dao.getAll().associateBy { it.id }

        val headphones = result["1"]!!
        assertEquals("Headphones", headphones.name)
        assertEquals("Electronics", headphones.category)
        assertEquals(129.0, headphones.price, 0.0)
        assertEquals(0.0, headphones.salePrice, 0.0)
        assertEquals(false, headphones.sale)
        assertEquals("#D8EDE3", headphones.bg)

        val watch = result["2"]!!
        assertEquals(true, watch.sale)
        assertEquals(249.0, watch.salePrice, 0.0)
    }

    @Test
    fun getAll_emptyTable_returnsEmptyList() = runTest {
        val result = dao.getAll()

        assertTrue(result.isEmpty())
    }

    // ─── insertAll IGNORE on conflict ─────────────────────────────────────────

    @Test
    fun insertAll_duplicateId_ignoresSecondInsert() = runTest {
        val original = CatalogEntity("1", "Headphones",     "Electronics", 129.0, 0.0, false, "#D8EDE3", "https://example.com/img1.jpg")
        val duplicate = CatalogEntity("1", "Headphones Pro", "Electronics", 149.0, 0.0, false, "#D8EDE3", "https://example.com/img1.jpg")

        dao.insertAll(listOf(original))
        dao.insertAll(listOf(duplicate))
        val result = dao.getAll()

        assertEquals(1, result.size)
        // original data preserved (IGNORE strategy)
        assertEquals("Headphones", result[0].name)
        assertEquals(129.0, result[0].price, 0.0)
    }

    @Test
    fun insertAll_calledTwiceWithSameData_deduplicates() = runTest {
        dao.insertAll(sampleItems)
        dao.insertAll(sampleItems) // second call should be ignored
        val result = dao.getAll()

        assertEquals(sampleItems.size, result.size)
    }

    // ─── seed pattern (empty → insert → read) ────────────────────────────────

    @Test
    fun seedPattern_emptyThenInsert_returnsSeededData() = runTest {
        var items = dao.getAll()
        if (items.isEmpty()) {
            dao.insertAll(sampleItems)
            items = dao.getAll()
        }

        assertEquals(sampleItems.size, items.size)
    }

    @Test
    fun seedPattern_notEmpty_doesNotInsertAgain() = runTest {
        dao.insertAll(sampleItems)

        // Simulate second app launch: table not empty → skip insertAll
        var items = dao.getAll()
        if (items.isEmpty()) {
            dao.insertAll(sampleItems)
            items = dao.getAll()
        }

        assertEquals(sampleItems.size, items.size)
    }
}
