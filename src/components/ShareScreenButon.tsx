import { Monitor} from "@phosphor-icons/react";

export const ShareScreenButon: React.FC<{onClick :() => void}>  = ({ onClick }) => {
  return (
    <>
        <button
            className="bg-rose-400 p-4 rounded-lg text-xl hover:bg-rose-600 text-white"
            onClick={onClick}
        >
            <Monitor size={28} />
        </button>
    </>
  );
}