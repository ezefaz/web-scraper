import HeroCarousel from "@/components/HeroCarousel";
import Searchbar from "@/components/Searchbar";
import Image from "next/image";

import { getAllProducts, getCurrentUser, getUserProducts } from "@/lib/actions";
import ProductCard from "@/components/ProductCard";
import Services from "@/components/Services";
import StepsComponent from "@/components/Steps";
import { ProductType } from "@/types";

const Home = async () => {
	const allProducts = await getAllProducts();
	const user = await getCurrentUser();
	const userProducts = await getUserProducts();

	return (
		<>
			<section
				className='px-6 md:px-20 py-24 mt-16'
				style={{
					backgroundImage: "url('/assets/images/hero2.png')",
					backgroundSize: "cover",
					height: "100vh",
					backgroundPosition: "center",
					opacity: "70%",
					backgroundColor: "rgba(255, 255, 255, 0.8)",
				}}>
				<div className='flex justify-center p-5 max-xl:flex-col gap-16'>
					<div>
						<div className='small-text mb-4'>
							<p className='text-muted-foreground text-xl'>
								Tu plataforma ideal para ahorrar dinero a largo plazo.
							</p>
							{/* <Image src='/assets/icons/arrow-right.svg' alt='arrow-right' width={16} height={16} /> */}
						</div>
						<div className='text-center'>
							<h1 className='text-6xl head-text'>
								<span className='relative'>
									Optimiza
									<span className='absolute bottom-0 left-0 w-full h-2 bg-primary'></span>
								</span>{" "}
								tus Compras
							</h1>

							<h1 className='head-text'>
								con Save<span className='text-primary'>Melin</span>
							</h1>
						</div>
						{""}
						{/* <p className='mt-6 text-gray-900'>
              A través de análisis y seguimiento de tus productos favoritos, te vamos a ayudar a ahorrar dinero a largo
              plazo.
            </p> */}
						<Searchbar />
					</div>
					{/* <HeroCarousel /> */}
				</div>
			</section>
			<Services />
			<StepsComponent />
			<section className='trending-section'>
				<h2 className='section-text'>
					{userProducts && userProducts.length > 1
						? "Tus Productos"
						: "Trending 🔥"}
				</h2>
				<div className='flex flex-wrap gap-x-8 gap-y-16'>
					{userProducts && userProducts.length > 1
						? userProducts &&
						  userProducts.map((product: ProductType) => (
								<ProductCard key={product._id} product={product} />
						  ))
						: allProducts &&
						  allProducts.map((product: ProductType) => (
								<ProductCard key={product._id} product={product} />
						  ))}
				</div>
			</section>
		</>
	);
};

export default Home;
