import useFetchSubjects from "../useFetchSubjects";
import axios from "../../axiosInstance";
import { useRef } from "react";
import { useContext } from "react";
import { generalContext } from "../../contexts/generalContext";
import { useNavigate } from "react-router-dom";
const SubjectsUpdater = () => {
  const navigate = useNavigate();
  let subjects = useFetchSubjects();
  const { showAlert } = useContext(generalContext);
  const _subj = useRef(null);

  let updater = (e) => {
    e.preventDefault();
    let data = _subj.current.value.split(",");
    axios.post("/update-subjects", { data }).then((response) => {
      if (response.data.err)
        return showAlert("warning", JSON.stringify(response.data.err));
      else showAlert("success", response.data.msg);
    });
    navigate("/Admin");
  };
  return (
    <div className="container my-4">
      <h1>Update total subjects</h1>
      <form className="special-form mx-auto" onSubmit={updater}>
        <textarea
          ref={_subj}
          required
          defaultValue={subjects}
          className="rounded w-100 fs-4 p-3"
          rows={10}
        ></textarea>
        <div className="mt-4">
          <button
            className="btn btn-secondary"
            onClick={() => navigate("/Admin/manage-classes")}
          >
            Cancel
          </button>
          <input
            type="submit"
            className="btn btn-light mx-2"
            value="Confirm & Update"
          />
        </div>
      </form>
    </div>
  );
};

export default SubjectsUpdater;
