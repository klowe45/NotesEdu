const Header = () => {
  return (
    <header className="flex pt-1 border-b border-black mb-5">
      <h1 className="text-black text-3xl m-0">NotesEdu</h1>
      <button
        className="bg-transparent bg-center bg-no-repeat bg-contain h-10 w-10 ml-auto border-0 cursor-pointer"
        style={{ backgroundImage: "url('../../assets/downdown-btn.png')" }}
      ></button>
    </header>
  );
};

export default Header;
