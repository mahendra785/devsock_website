interface InfoCardProps {
  backgroundColor: string;
  text: string;
}

const InfoCard = ({ backgroundColor, text }: InfoCardProps) => {
  return (
    <div
      className={`flex flex-col items-center space-y-4 px-8 py-4 h-[20vh] w-1/4  hover:scale-105 transition-transform duration-300 ease-in-out`}
      style={{ backgroundColor }}
    >
      <div className="w-[374px] h-[0px] border-2 border-[#757575]"></div>
      <p className="text-black flex items-center justify-center h-full text-3xl text-center">
        {text}
      </p>
    </div>
  );
};

export default InfoCard;
