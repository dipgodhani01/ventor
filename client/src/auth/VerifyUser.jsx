import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { SERVER } from "../Constant/vriables";
import { Loader } from "../components/common/Loader";

function Verify() {
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { token } = useParams();

  async function verifyUser() {
    setLoading(true);
    try {
      const { data } = await axios.post(`${SERVER}/verify/${token}`);
      setSuccess(data.message);
    } catch (error) {
      setError(error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    verifyUser();
  }, []);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="w-[280px] m-auto mt-48">
          {success && <p className="text-green-600 text-2xl">{success}</p>}
          {error && <p className="text-red-600 text-2xl">{error}</p>}
        </div>
      )}
    </>
  );
}

export default Verify;
