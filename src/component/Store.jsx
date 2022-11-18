import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../UserContext.js";
import {
  BrandsService,
  CategoriesService,
  ProductService,
} from "../Service.js";
import Product from "./Product";

const Store = () => {
  const UserContext = useContext(UserContext);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [productToShow, setProductToShow] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    (async () => {
      let brandResponse = await BrandsService.fetchBrands();

      let brandResponseBody = await brandResponse.json();

      brandResponseBody.forEach((brand) => {
        brand.isChecked = true;
      });

      setBrands(brandResponseBody);

      let categoriesResponse = await CategoriesService.fetchCategories();

      let categoriesResponseBody = await categoriesResponse.json();

      categoriesResponseBody.forEach((category) => {
        category.isChecked = true;
      });

      setCategories(categoriesResponseBody);

      let productsResponse = await fetch(
        `http://localhost:5000/products?productName_like=${search}`,
        { method: "GET" }
      );

      let productsResponseBody = await productsResponse.json();

      if (productsResponse.ok) {
        productsResponseBody.forEach((product) => {
          product.brand = BrandsService.getBrandByBrandId(
            brandResponseBody,
            product.brandId
          );

          product.category = CategoriesService.getCategoryByCategoryId(
            categoriesResponseBody,
            product.categoryId
          );

          product.isOrdered = false;
        });
      }

      setProducts(productsResponseBody);
      setProductToShow(productsResponseBody);
      document.title = "Store";
    })();
  }, [search]);

  const updateBrandIsChecked = (id) => {
    let brandsData = brands.map((brand) => {
      if (brand.id === id) brand.isChecked = !brand.isChecked;
      return brand;
    });

    setBrands(brandsData);
    updateProductToShow();
  };

  const updateCategoriesChecked = (id) => {
    let categoriesData = categories.map((category) => {
      if (category.id === id) category.isChecked = !category.isChecked;
      return category;
    });

    setCategories(categoriesData);
    updateProductToShow();
  };

  const updateProductToShow = () => {
    setProductToShow(
      products
        .filter((prod) => {
          return (
            categories.filter(
              (cat) => cat.id === prod.categoryId && cat.isChecked
            ).length > 0
          );
        })
        .filter((prod) => {
          return (
            brands.filter(
              (brand) => brand.id === prod.brandId && brand.isChecked
            ).length > 0
          );
        })
    );
  };

  const onAddToCartClick = (product) => {
    (async () => {
      let newOrder = {
        userId: UserContext.user.currentUserId,
        productId: product.id,
        quantity: 1,
        isPaymentCompleted: false,
      };
      let orderResponse = await fetch(`http://localhost:5000/orders`, {
        method: "POST",
        body: JSON.stringify(newOrder),
        headers: { "Content-Type": "application/json" },
      });
      if (orderResponse.ok) {
        let orderResponseBody = await orderResponse.json();
        let prods = products.map((p) => {
          if (p.id === product.id) p.isOrdered = true;
          return p;
        });
        setProducts(prods);
        updateProductToShow();
      } else {
        console.log(orderResponse);
      }
    })();
  };

  return (
    <div className="row py-3">
      <div className="col-lg-3 title card-product">
        <h4 className="py-2 m-0 d-flex justify-content-between align-items-center">
          <span>
            <i className="text-3xl font-bold underline"></i>Store{" "}
          </span>
          <span className="badge bg-secondary bage-header">
            {productToShow.length}
          </span>
        </h4>
      </div>

      <div className="col-lg-9 py-2">
        <input
          type="search"
          value={search}
          placeholder="Search Product"
          className="form-control input-login"
          autoFocus="autofocus"
          onChange={(e) => {
            setSearch(e.target.value);
          }}
        />
      </div>

      <div className="row mx-auto">
        <div className="col-lg-3 py-2">
          <div className="my-2">
            <h5 className="title-filter">Brands</h5>
            <ul className="list-group list-group-flush ">
              {brands.map((brand) => (
                <li className="list-group-item selected" key={brand.id}>
                  <div className="form-check">
                    <input
                      type="checkBox"
                      className="form-check-input bg-secondary"
                      value="true"
                      checked={brand.isChecked}
                      id={`brand${brand.id}`}
                      onChange={() => {
                        updateBrandIsChecked(brand.id);
                      }}
                    />
                    <label
                      htmlFor={`brand${brand.id}`}
                      className="form-check-label"
                    >
                      {brand.brandName}
                    </label>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="my-2">
            <h5 className="title-filter">Categories</h5>
            <ul className="list-group list-group-flush">
              {categories.map((category) => (
                <li className="list-group-item selected" key={category.id}>
                  <div className="form-check">
                    <input
                      type="checkBox"
                      className="form-check-input bg-secondary"
                      value="true"
                      checked={category.isChecked}
                      id={`category${category.id}`}
                      onChange={() => {
                        updateCategoriesChecked(category.id);
                      }}
                    />
                    <label
                      htmlFor={`category${category.id}`}
                      className="form-check-label"
                    >
                      {category.categoryName}
                    </label>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="col-lg-9 py-2">
          <div className="row">
            {productToShow.map((product) => (
              <Product
                key={product.id}
                product={product}
                onAddToCartClick={onAddToCartClick}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Store;
