class Product(
    val id: Int,
    val name: String,
    val price: Double,
    val category: String,
    var stock: Int?
)

fun stockLabel(stock: Int?): String {
    return when {
        stock == null -> "Sin dato"
        stock == 0 -> "Agotado"
        stock < 5 -> "Pocas unidades"
        else -> "Disponible"
    }
}

fun applyDiscount(price: Double, percent: Int): Double {
    return price * (1 - percent / 100.0)
}

fun main() {
    val products = listOf(
        Product(
            id = 1,
            name = "Agua mineral 600 ml",
            price = 1800.0,
            category = "Bebidas",
            stock = 120
        ),
        Product(
            id = 2,
            name = "Galletas de avena x6",
            price = 2700.0,
            category = "Snacks",
            stock = 0
        ),
        Product(
            id = 3,
            name = "Producto sin inventario",
            price = 10000.0,
            category = "Hogar",
            stock = null
        )
    )

    for (product in products) {
        val discountedPrice = applyDiscount(product.price, 10)

        println("Producto: ${product.name}")
        println("Stock: ${stockLabel(product.stock)}")
        println("Precio con 10% de descuento: $discountedPrice")
        println()
    }
}