const TailwindTest = () => {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold text-blue-600 mb-4">Tailwind CSS Test</h2>
        <div className="flex space-x-4">
          <div className="bg-red-500 text-white p-4 rounded-lg">Red Box</div>
          <div className="bg-green-500 text-white p-4 rounded-lg">Green Box</div>
          <div className="bg-blue-500 text-white p-4 rounded-lg">Blue Box</div>
        </div>
      </div>
    );
  };
  
  export default TailwindTest;