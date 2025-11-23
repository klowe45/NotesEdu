const About = () => {
  return (
    <div className="flex flex-col mt-4 sm:mt-5 md:mt-6 lg:mt-2">
      <h3 className="flex justify-center text-2xl sm:text-3xl md:text-4xl lg:text-2xl font-bold my-2 sm:my-2.5 md:my-3 lg:my-1">
        About NeuroNotes
      </h3>
      <div className="flex flex-col justify-center opacity-70 text-sm sm:text-base md:text-lg lg:text-base mb-2 sm:mb-2 md:mb-2.5 lg:mb-1 px-4">
        <span className="flex justify-center">
          NeuroNotes makes it easy to track client
        </span>
        <span className="flex justify-center">
          progress, manage charts, and stay
        </span>
        <span className="flex justify-center">organized with a clean, </span>
        <span className="flex justify-center">intuitive dashboard.</span>
      </div>
    </div>
  );
};

export default About;
