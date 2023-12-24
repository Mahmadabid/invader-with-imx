const Card: React.FC<{ image: string; name: string; price: string; onButtonClick: () => void }> = ({
    image,
    name,
    price,
    onButtonClick,
}) => {
    return (
        <div className="max-w-xs mx-auto bg-white shadow-lg shadow-slate-600 rounded-lg overflow-hidden mb-4">
            {image === '/gray.png' ?
                <div className="bg-gray-900 text-white w-56 h-96 flex items-center justify-center">
                    <p className="text-xl font-bold">Coming Soon</p>
                </div>
                :
                <div>
                    <img className="w-56 h-56 object-cover object-center" src={image} alt={name} />
                    <div className="px-6 py-4">
                        <div className="font-bold text-xl mb-2">{name}</div>
                        <p className="text-gray-700 text-base font-medium flex flex-row">{price} <img src="/IPX.png" width={28} height={28} /></p>
                    </div>
                    <div className="px-6 pt-4">
                        <button
                            onClick={onButtonClick}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        >
                            Buy Now
                        </button>
                    </div>
                </div>}
        </div>
    );
};

export default Card;
