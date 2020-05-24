[@react.component]
let make = (~destination: Data.destination) => {
  <div
    className="flex items-center rounded-lg bg-white shadow-lg overflow-hidden">
    <img
      className="h-32 w-32 flex-shrink-0"
      src={destination.imageUrl}
      alt={destination.imageAlt}
    />
    <div className="px-6 py-4">
      <h3 className="text-lg font-semibold text-gray-800">
        {React.string(destination.city)}
      </h3>
      <p className="text-gray-600">
        {React.string(
           "$"
           ++ string_of_int(destination.averagePrice)
           ++ " / night average",
         )}
      </p>
      <div className="mt-4">
        <a
          href="#"
          className="text-indigo-500 hover:text-indigo-400
          font-semibold text-sm">
          {React.string(
             "Explore "
             ++ string_of_int(destination.propertyCount)
             ++ " properties",
           )}
        </a>
      </div>
    </div>
  </div>;
};
