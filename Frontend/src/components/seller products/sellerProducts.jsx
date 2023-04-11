// useEffect(() => {
//     const fetchProducts = async () => {
//       const user = JSON.parse(localStorage.getItem("user"));

//       if (user) {
//         setAuthor(user.username);
//       }

//       try {
//         const response = await productService.getSellerProducts(user.username);
//         setProducts(response.data);
//       } catch (error) {
//         console.log(error);
//       }
//     };
//     fetchProducts();
//   }, []);

// const Register = () => {
// }