import sale from "@/public/sale.png";
import Image from "next/image";
import Link from "next/link";
export default function ProductCard({ product }) {
  return (
    <div className="md:w-1/3 inline-block md:p-5 my-5 sm:w-1/2 p-2 shadow-md">
      {product.discountPercentage <= 7 && (
        <Image src={sale} width={60} className="float-left "></Image>
      )}
      <img
        src={product.thumbnail}
        alt={product.title}
        className="w-9/12 mx-auto bg-white"
      />
      <div className="text-center font-serif p-2">
        <p className="text-xl font-sans font-bold p-1">{product.title}</p>
        <p className=" ">{product.description}</p>
        <Link
          className="hover:text-blue-300 transition-all duration-300 hover:bg-white my-3 rounded-xl w-1/3 md:p-2 block mx-auto text-white align-middle bg-blue-300"
          key={product.id}
          href={`/details/${product.id}`}
        >
          <p className="text-xl">$ {product.price} </p>
        </Link>
      </div>
    </div>
  );
}
