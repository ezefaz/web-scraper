"use client";

import {
	BadgeDelta,
	Button,
	Card,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeaderCell,
	TableRow,
	Text,
} from "@tremor/react";
import { Fragment, useEffect, useState } from "react";
import { BsArrowsExpand } from "react-icons/bs";
import TableDropdown from "../TableDropdown";
import { Dialog, Transition } from "@headlessui/react";
import BusinessProductBadge from "./BusinessProductBadge";
import PublishProductModal from "./modal/PublishProductModal";

export default function BusinessProductsTable({ userProducts }: any) {
	const [isOpen, setIsOpen] = useState(false);

	const openModal = () => setIsOpen(true);
	const closeModal = () => setIsOpen(false);

	const soldProducts = userProducts.filter(
		(product: any) => product.sold_quantity > 0
	);

	return (
		<>
			<div className='p-5 w-full flex flex-col items-start'>
				<h3 className='font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong text-lg'>
					Listado de productos
				</h3>
				<p className='mt-2 text-tremor-default leading-6 text-tremor-content dark:text-dark-tremor-content'>
					En esta sección puedes observar todos los productos que has publicado.{" "}
					Además, puedes publicar productos desde aquí mismo de una manera más
					sencilla y rápida.
				</p>
				<div className='mt-3'>
					<BusinessProductBadge
						soldProducts={soldProducts}
						totalProducts={userProducts.length}
					/>
				</div>
			</div>
			<div className='w-45 ml-3 flex items-start'>
				<Card className='relative w-[60%] flex justify-start items-start mx-auto h-96 overflow-hidden '>
					<Table className='w-[100%]'>
						<TableHead>
							<TableRow>
								{/* <TableHeaderCell className="bg-white text-center">
                  Imagen
                </TableHeaderCell> */}
								<TableHeaderCell className='bg-white text-center'>
									Título
								</TableHeaderCell>
								<TableHeaderCell className='bg-white text-center'>
									Categoría
								</TableHeaderCell>
								<TableHeaderCell className='bg-white text-center'>
									Stock
								</TableHeaderCell>
								<TableHeaderCell className='bg-white text-center'>
									Condición
								</TableHeaderCell>
								<TableHeaderCell className='bg-white text-center'>
									Precio ($)
								</TableHeaderCell>
								<TableHeaderCell className='bg-white text-center'>
									Status
								</TableHeaderCell>
								<TableHeaderCell className='bg-white text-center'>
									Garantía
								</TableHeaderCell>
								<TableHeaderCell className='bg-white text-center'>
									Tipo de publicación
								</TableHeaderCell>
								<TableHeaderCell className='bg-white text-center'>
									Fecha de publicación
								</TableHeaderCell>
								<TableHeaderCell className='bg-white text-center'>
									Acciones
								</TableHeaderCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{userProducts?.map((product: any) => (
								<TableRow
									key={product.id}
									className='hover:bg-gray-50 cursor-pointer'>
									{/* <TableCell> */}
									{/* <Image
                      src={product.thumbnail}
                      alt={product.title}
                      height={200}
                      width={200}
                    /> */}
									{/* </TableCell> */}
									<TableCell>
										<a
											className='text-blue-500 hover:underline'
											href={product.permalink}
											target='_blank'
											rel='noopener noreferrer'>
											{product.title}
										</a>
									</TableCell>
									<TableCell>{product.category_id}</TableCell>
									<TableCell>
										<Text>
											{product.available_quantity == 1
												? `${product.available_quantity} disponible`
												: product.available_quantity}
										</Text>
									</TableCell>
									<TableCell>
										<Text>{product.condition}</Text>
									</TableCell>
									<TableCell>
										<Text>{`${product.currency_id} ${product.price}`}</Text>
									</TableCell>
									<TableCell>
										<TableCell className='text-right'>
											<BadgeDelta
												deltaType={
													product.status != "closed" ? "increase" : "unchanged"
												}
												size='xs'>
												{product.status == "closed" ? "Cerrado" : "Abierto"}
											</BadgeDelta>
										</TableCell>
									</TableCell>
									<TableCell>
										<TableCell className='text-right'>
											<BadgeDelta
												deltaType={
													product.warranty != "Sin garantía"
														? "increase"
														: "unchanged"
												}
												size='xs'>
												{product.warranty}
											</BadgeDelta>
										</TableCell>
									</TableCell>
									<TableCell>{product.listing_type_id}</TableCell>
									<TableCell>{product.date_created}</TableCell>
									<TableCell>
										<TableDropdown
											url={product.permalink}
											productId={product.id}
											isFollowing={product.isFollowing}
										/>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
					<div className='inset-x-0 bottom-0 flex justify-center bg-gradient-to-t mt-4 from-white pt-12 pb-8 absolute rounded-b-lg'>
						{userProducts.length > 5 ? (
							<Button
								icon={BsArrowsExpand}
								className='bg-white shadow-md border-gray-200 text-gray-500 hover:bg-gray-50 hover:border-gray-300'
								onClick={openModal}>
								Mostrar Más
							</Button>
						) : null}
					</div>
				</Card>
			</div>

			<Transition appear show={isOpen} as={Fragment}>
				<Dialog as='div' className='relative z-50' onClose={closeModal}>
					<Transition.Child
						as={Fragment}
						enter='ease-out duration-300'
						enterFrom='opacity-0'
						enterTo='opacity-100'
						leave='ease-in duration-200'
						leaveFrom='opacity-100'
						leaveTo='opacity-0'>
						<div className='fixed inset-0 bg-gray-900 bg-opacity-25' />
					</Transition.Child>
					<div className='fixed inset-0 overflow-y-auto'>
						<div className='flex min-h-full items-center justify-center p-4 text-center'>
							<Transition.Child
								as={Fragment}
								enter='ease-out duration-300'
								enterFrom='opacity-0 scale-95'
								enterTo='opacity-100 scale-100'
								leave='ease-in duration-200'
								leaveFrom='opacity-100 scale-100'
								leaveTo='opacity-0 scale-95'>
								<Dialog.Panel
									className='w-[80%] transform overflow-hidden ring-tremor bg-white
                                p-6 text-left align-middle shadow-tremor transition-all rounded-xl'>
									<div className='relative mt-3 w-full'>
										<Table className='h-[450px]'>
											<TableHead>
												<TableRow>
													{/* <TableHeaderCell className="bg-white text-center">
                  Imagen
                </TableHeaderCell> */}
													<TableHeaderCell className='bg-white text-center'>
														Título
													</TableHeaderCell>
													<TableHeaderCell className='bg-white text-center'>
														Categoría
													</TableHeaderCell>
													<TableHeaderCell className='bg-white text-center'>
														Stock
													</TableHeaderCell>
													<TableHeaderCell className='bg-white text-center'>
														Condición
													</TableHeaderCell>
													<TableHeaderCell className='bg-white text-center'>
														Precio ($)
													</TableHeaderCell>
													<TableHeaderCell className='bg-white text-center'>
														Status
													</TableHeaderCell>
													<TableHeaderCell className='bg-white text-center'>
														Garantía
													</TableHeaderCell>
													<TableHeaderCell className='bg-white text-center'>
														Tipo de publicación
													</TableHeaderCell>
													<TableHeaderCell className='bg-white text-center'>
														Fecha de publicación
													</TableHeaderCell>
													<TableHeaderCell className='bg-white text-center'>
														Acciones
													</TableHeaderCell>
												</TableRow>
											</TableHead>
											<TableBody>
												{userProducts?.map((product: any) => (
													<TableRow
														key={product.id}
														className='hover:bg-gray-50 cursor-pointer'>
														{/* <TableCell> */}
														{/* <Image
                      src={product.thumbnail}
                      alt={product.title}
                      height={200}
                      width={200}
                    /> */}
														{/* </TableCell> */}
														<TableCell>
															<a
																className='text-blue-500 hover:underline'
																href={product.permalink}
																target='_blank'
																rel='noopener noreferrer'>
																{product.title}
															</a>
														</TableCell>
														<TableCell>{product.category_id}</TableCell>
														<TableCell>
															<Text>
																{product.available_quantity == 1
																	? `${product.available_quantity} disponible`
																	: product.available_quantity}
															</Text>
														</TableCell>
														<TableCell>
															<Text>{product.condition}</Text>
														</TableCell>
														<TableCell>
															<Text>{`${product.currency_id} ${product.price}`}</Text>
														</TableCell>
														<TableCell>
															<TableCell className='text-right'>
																<BadgeDelta
																	deltaType={
																		product.status != "closed"
																			? "increase"
																			: "unchanged"
																	}
																	size='xs'>
																	{product.status == "closed"
																		? "Cerrado"
																		: "Abierto"}
																</BadgeDelta>
															</TableCell>
														</TableCell>
														<TableCell>
															<TableCell className='text-right'>
																<BadgeDelta
																	deltaType={
																		product.warranty != "Sin garantía"
																			? "increase"
																			: "unchanged"
																	}
																	size='xs'>
																	{product.warranty}
																</BadgeDelta>
															</TableCell>
														</TableCell>
														<TableCell>{product.listing_type_id}</TableCell>
														<TableCell>{product.date_created}</TableCell>
														<TableCell>
															<TableDropdown
																url={product.permalink}
																productId={product.id}
																isFollowing={product.isFollowing}
															/>
														</TableCell>
													</TableRow>
												))}
											</TableBody>
											<div className='absolute inset-x-0 bottom-0 bg-gradient-to-b from-transparent to-white z-0 h-20 w-full' />
										</Table>
									</div>
									<Button
										className='mt-5 w-full bg-white border-gray-200 text-gray-500 hover:bg-gray-50 hover:border-gray-300'
										onClick={closeModal}>
										Volver
									</Button>
								</Dialog.Panel>
							</Transition.Child>
						</div>
					</div>
				</Dialog>
			</Transition>
		</>
	);
}
