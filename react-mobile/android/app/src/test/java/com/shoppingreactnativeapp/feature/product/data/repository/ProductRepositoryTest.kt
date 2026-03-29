package com.shoppingreactnativeapp.feature.product.data.repository

import com.shoppingreactnativeapp.feature.product.data.local.dao.ProductDao
import com.shoppingreactnativeapp.feature.product.data.local.entity.ProductEntity
import com.shoppingreactnativeapp.feature.product.data.repository.ProductRepository
import io.mockk.coEvery
import io.mockk.coVerify
import io.mockk.every
import io.mockk.just
import io.mockk.mockk
import io.mockk.Runs
import io.mockk.verify
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.flow.flowOf
import kotlinx.coroutines.test.runTest
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Before
import org.junit.Test

class ProductRepositoryTest {

    private lateinit var productDao: ProductDao
    private lateinit var repository: ProductRepository

    @Before
    fun setUp() {
        productDao = mockk()
        repository = ProductRepository(productDao)
    }

    // ─── getProductList ───────────────────────────────────────────────────────

    @Test
    fun `getProductList returns items from dao`() = runTest {
        val items = listOf(
            ProductEntity(id = 1, productId = "P001", productName = "Headphones", price = 129.0)
        )
        every { productDao.getAll() } returns flowOf(items)

        val result = repository.getProductList().first()

        assertEquals(items, result)
        verify { productDao.getAll() }
    }

    @Test
    fun `getProductList returns empty list when dao is empty`() = runTest {
        every { productDao.getAll() } returns flowOf(emptyList())

        val result = repository.getProductList().first()

        assertTrue(result.isEmpty())
    }

    // ─── addToProductList ─────────────────────────────────────────────────────

    @Test
    fun `addToProductList delegates to dao insert`() = runTest {
        val item = ProductEntity(productId = "P001", productName = "Headphones", price = 129.0)
        coEvery { productDao.insert(item) } just Runs

        repository.addToProductList(item)

        coVerify(exactly = 1) { productDao.insert(item) }
    }

    // ─── removeFromProductList ────────────────────────────────────────────────

    @Test
    fun `removeFromProductList delegates to dao deleteByProductId`() = runTest {
        coEvery { productDao.deleteByProductId("P001") } just Runs

        repository.removeFromProductList("P001")

        coVerify(exactly = 1) { productDao.deleteByProductId("P001") }
    }

    // ─── isInProductList ──────────────────────────────────────────────────────

    @Test
    fun `isInProductList returns true when product exists`() = runTest {
        coEvery { productDao.exists("P001") } returns true

        val result = repository.isInProductList("P001")

        assertTrue(result)
    }

    @Test
    fun `isInProductList returns false when product does not exist`() = runTest {
        coEvery { productDao.exists("P999") } returns false

        val result = repository.isInProductList("P999")

        assertFalse(result)
    }
}
