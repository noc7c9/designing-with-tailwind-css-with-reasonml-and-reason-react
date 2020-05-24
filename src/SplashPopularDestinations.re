[@react.component]
let make = () => {
  <div>
    <div
      className="max-w-md sm:max-w-xl lg:max-w-6xl mx-auto px-8 lg:px-12 py-8">
      <h2 className="text-xl text-gray-900">
        {React.string("Popular destinations")}
      </h2>
      <p className="text-gray-600">
        {React.string(
           "A selection of great work-friendly cities with lots to see and explore.",
         )}
      </p>
      <div className="flex flex-wrap -mx-4">
        {Data.popularDestinations
         ->Belt.Array.map(destination =>
             <div className="mt-6 w-full px-4 lg:w-1/2 xl:w-1/3">
               <DestinationCard destination />
             </div>
           )
         ->React.array}
      </div>
    </div>
  </div>;
};
