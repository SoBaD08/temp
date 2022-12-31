import { Divider } from "antd";
import { useEditorMode } from "../../../../common/EditorMode/index";
import { useTextData } from "../../../../common/TextData";
import EditAlign from "./EditAlign";
import styles from "./editText.module.scss";
import RichText from "./RichText";
import Transform from "../Transform/Transfrom";
import useTrans from "@/src/common/useTrans";
function EditText(props) {
  const { currentMode } = useEditorMode();
  const { editText, selectedText, selectedBlock, textData } = useTextData();
  return (
    <div className={styles.container}>
      {currentMode ? (
        <>
          <div className={styles.title}>{useTrans(`EditText`)}</div>
          <div className={styles.body}>
            <>
              <EditAlign />
              <Divider style={{ margin: "0px" }} />
            </>
            {<Transform />}
            {editText ? <RichText /> : null}
          </div>
        </>
      ) : null}
    </div>
  );
}

export default EditText;
