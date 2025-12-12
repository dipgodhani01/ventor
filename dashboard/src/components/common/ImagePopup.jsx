import { IoCloseSharp } from "react-icons/io5";

function ImagePopup({ setOpen, thumbnail }) {
  return (
    <div className="fixed inset-0 bg-black/70 z-[10000] flex items-center justify-center p-4">
      <div className="relative w-full h-[40vh] sm:h-[65vh] md:h-[648px] lg:h-[720px] md:w-[580px] lg:w-[680px]">
        <button
          onClick={() => setOpen(false)}
          className="absolute top-2 right-2 bg-black/60 text-white text-2xl p-1 rounded-full hover:bg-black/80 transition z-20"
        >
          <IoCloseSharp />
        </button>

        <img
          src={thumbnail}
          alt="Thumbnail"
          className="w-full h-full min-w-full min-h-full object-cover rounded-lg shadow-xl"
        />
      </div>
    </div>
  );
}

export default ImagePopup;
