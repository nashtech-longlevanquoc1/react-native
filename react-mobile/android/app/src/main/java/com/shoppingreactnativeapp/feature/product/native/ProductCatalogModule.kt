package com.shoppingreactnativeapp.feature.product.native

import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class ProductCatalogModule(
    reactContext: ReactApplicationContext
) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String = "ProductCatalogModule"

    @ReactMethod
    fun getProductCatalog(promise: Promise) {
        try {
            val catalog = listOf(
                mapOf(
                    "id" to "1",
                    "name" to "Sonic-ü Wireless Headphones",
                    "category" to "Electronics",
                    "price" to 129.0,
                    "salePrice" to 0.0,
                    "sale" to false,
                    "bg" to "#D8EDE3",
                    "image" to "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80"
                ),
                mapOf(
                    "id" to "2",
                    "name" to "Metro Classic Timewatch Limited Edition",
                    "category" to "Fashion",
                    "price" to 85.5,
                    "salePrice" to 0.0,
                    "sale" to false,
                    "bg" to "#E8F0E8",
                    "image" to "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80"
                ),
                mapOf(
                    "id" to "3",
                    "name" to "Artisan Ceramic Mug",
                    "category" to "Home",
                    "price" to 24.0,
                    "salePrice" to 0.0,
                    "sale" to false,
                    "bg" to "#D8EDE3",
                    "image" to "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=400&q=80"
                ),
                mapOf(
                    "id" to "4",
                    "name" to "Glow Essentials Kit",
                    "category" to "Beauty",
                    "price" to 45.0,
                    "salePrice" to 60.0,
                    "sale" to true,
                    "bg" to "#E8EDD8",
                    "image" to "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400&q=80"
                ),
                mapOf(
                    "id" to "5",
                    "name" to "Leather Tote Bag",
                    "category" to "Fashion",
                    "price" to 99.0,
                    "salePrice" to 0.0,
                    "sale" to false,
                    "bg" to "#EDE8D8",
                    "image" to "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&q=80"
                ),
                mapOf(
                    "id" to "6",
                    "name" to "Smart Watch Pro",
                    "category" to "Electronics",
                    "price" to 199.0,
                    "salePrice" to 249.0,
                    "sale" to true,
                    "bg" to "#D8E8ED",
                    "image" to "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400&q=80"
                ),
                mapOf(
                    "id" to "7",
                    "name" to "Minimalist Desk Lamp",
                    "category" to "Home",
                    "price" to 39.0,
                    "salePrice" to 0.0,
                    "sale" to false,
                    "bg" to "#EDE8D8",
                    "image" to "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&q=80"
                ),
                mapOf(
                    "id" to "8",
                    "name" to "Yoga Mat Premium",
                    "category" to "Beauty",
                    "price" to 32.0,
                    "salePrice" to 48.0,
                    "sale" to true,
                    "bg" to "#D8EDE3",
                    "image" to "https://images.unsplash.com/photo-1600881333168-2ef49b341f30?w=400&q=80"
                )
            )

            val result = Arguments.createArray()
            catalog.forEach { item ->
                val map = Arguments.createMap()
                map.putString("id", item["id"] as String)
                map.putString("name", item["name"] as String)
                map.putString("category", item["category"] as String)
                map.putDouble("price", item["price"] as Double)
                map.putDouble("salePrice", item["salePrice"] as Double)
                map.putBoolean("sale", item["sale"] as Boolean)
                map.putString("bg", item["bg"] as String)
                map.putString("image", item["image"] as String)
                result.pushMap(map)
            }
            promise.resolve(result)
        } catch (e: Exception) {
            promise.reject("CATALOG_ERROR", e.message, e)
        }
    }
}
