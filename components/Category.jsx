export default function Category({
  category,
  activeCategory,
  handleCategoryClick,
}) {
  const active =
    "text-white transition-all duration-300 p-2 text-center cursor-pointer bg-blue-300 rounded-md border-2 border-slate-200 shadow-md shadow-slate-200/50";
  const unactive =
    "p-2 text-center cursor-pointer bg-white color-white rounded-md border-2 border-slate-200 shadow-md shadow-slate-200/50";

  const handleClick = (item) => {
    handleCategoryClick(item);
  };

  return (
    <div>
      {category ? (
        <div className="font-serif md:text-base text-sm w-11/12 pt-24 bg-slate-100/50 mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 md:gap-5 gap-2">
            {category.map((item) => (
              <div
                key={item}
                className={
                  item.toLowerCase() === activeCategory.toLowerCase()
                    ? active
                    : unactive
                }
                onClick={() => handleClick(item)}
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-48">
          <Loading />
        </div>
      )}
    </div>
  );
}
