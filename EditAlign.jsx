import { Col, message, Row } from "antd";
import styles from "./editText.module.scss";
import { useTextData } from "../../../../common/TextData";
import { useImageData } from "../../../../common/ImageData";
import { useHistory } from "@/src/common/History";
import ReactShortcut from "react-shortcut";
import { publicRuntimeConfig } from "@/next.config";
import useTrans from "@/src/common/useTrans";

const EditAlign = () => {
  const {
    selectedText,
    multipleSelect,
    setMultipleSelect,
    setSelectText,
    textData,
    setTextData,
    TopZindex,
    LastZindex,
  } = useTextData();
  const { setHistory } = useHistory();

  const { width, height, ratio } = useImageData();
  const ChooseMulLayer = useTrans(`ChooseMulLayer`);
  const ChooseLayer = useTrans(`ChooseLayer`);

  const handleALign = (type) => {
    if (!(multipleSelect && multipleSelect.length > 1)) {
      message.warning(ChooseMulLayer);
      return;
    }
    let minX = 9999;
    let minY = 9999;
    let maxX = 0;
    let maxY = 0;
    let standardSelect = [...multipleSelect].map((item) => {
      let width =
        item.rectangle_coordinates[1].x - item.rectangle_coordinates[0].x;
      let height =
        item.rectangle_coordinates[2].y - item.rectangle_coordinates[0].y;
      return {
        ...item,
        width: width,
        height: height,
      };
    });
    for (let i = 0; i < standardSelect.length; i++) {
      let selectItem = standardSelect[i];
      minX = Math.min(minX, selectItem.rectangle_coordinates[0].x);
      minY = Math.min(minY, selectItem.rectangle_coordinates[0].y);
      maxX = Math.max(maxX, selectItem.rectangle_coordinates[2].x);
      maxY = Math.max(maxY, selectItem.rectangle_coordinates[2].y);
    }
    switch (type) {
      case "left":
        standardSelect = standardSelect.map((item) => {
          let retange = [...item.rectangle_coordinates];
          let newRetange = [
            {
              x: minX,
              y: retange[0].y,
            },
            {
              x: minX + item.width,
              y: retange[1].y,
            },
            {
              x: minX + item.width,
              y: retange[2].y,
            },
            {
              x: minX,
              y: retange[3].y,
            },
          ];
          return {
            ...item,
            rectangle_coordinates: newRetange,
          };
        });
        break;

      case "center":
        standardSelect = standardSelect.map((item) => {
          let retange = [...item.rectangle_coordinates];
          let newRetange = [
            {
              x: (maxX + minX - item.width) / 2,
              y: retange[0].y,
            },
            {
              x: (maxX + minX - item.width) / 2 + item.width,
              y: retange[1].y,
            },
            {
              x: (maxX + minX - item.width) / 2 + item.width,
              y: retange[2].y,
            },
            {
              x: (maxX + minX - item.width) / 2,
              y: retange[3].y,
            },
          ];
          return {
            ...item,
            rectangle_coordinates: newRetange,
          };
        });
        break;

      case "right":
        standardSelect = standardSelect.map((item) => {
          let retange = [...item.rectangle_coordinates];
          let newRetange = [
            {
              x: maxX - item.width,
              y: retange[0].y,
            },
            {
              x: maxX,
              y: retange[1].y,
            },
            {
              x: maxX,
              y: retange[2].y,
            },
            {
              x: maxX - item.width,
              y: retange[3].y,
            },
          ];
          return {
            ...item,
            rectangle_coordinates: newRetange,
          };
        });
        break;

      case "top":
        standardSelect = standardSelect.map((item) => {
          let retange = [...item.rectangle_coordinates];
          let newRetange = [
            {
              x: retange[0].x,
              y: minY,
            },
            {
              x: retange[1].x,
              y: minY,
            },
            {
              x: retange[2].x,
              y: minY + item.height,
            },
            {
              x: retange[3].x,
              y: minY + item.height,
            },
          ];
          return {
            ...item,
            rectangle_coordinates: newRetange,
          };
        });
        break;

      case "middle":
        standardSelect = standardSelect.map((item) => {
          let retange = [...item.rectangle_coordinates];
          let newRetange = [
            {
              x: retange[0].x,
              y: (maxY + minY - item.height) / 2,
            },
            {
              x: retange[1].x,
              y: (maxY + minY - item.height) / 2,
            },
            {
              x: retange[2].x,
              y: (maxY + minY - item.height) / 2 + item.height,
            },
            {
              x: retange[3].x,
              y: (maxY + minY - item.height) / 2 + item.height,
            },
          ];
          return {
            ...item,
            rectangle_coordinates: newRetange,
          };
        });
        break;

      case "bottom":
        standardSelect = standardSelect.map((item) => {
          let retange = [...item.rectangle_coordinates];
          let newRetange = [
            {
              x: retange[0].x,
              y: maxY - item.height,
            },
            {
              x: retange[1].x,
              y: maxY - item.height,
            },
            {
              x: retange[2].x,
              y: maxY,
            },
            {
              x: retange[3].x,
              y: maxY,
            },
          ];
          return {
            ...item,
            rectangle_coordinates: newRetange,
          };
        });
        break;

      default:
        break;
    }
    let newTextData = [...textData]; // copy textData because textData is state
    for (let i = 0; i < textData.length; i++) {
      let layerSelect = standardSelect.find(
        (item) => item.id == textData[i].id
      );
      if (layerSelect) {
        newTextData[i] = layerSelect;
      }
    }
    setTextData(newTextData);
    setMultipleSelect(standardSelect);
    setHistory({ textData: newTextData });
  };

  const intersect = (layer) => {
    let x1Layer = layer.rectangle_coordinates[0].x;
    let x2Layer = layer.rectangle_coordinates[1].x;
    let y1Layer = layer.rectangle_coordinates[0].y;
    let y2Layer = layer.rectangle_coordinates[2].y;
    let layerIntersect = [];
    [...textData].forEach((item) => {
      let x1 = item.rectangle_coordinates[0].x;
      let x2 = item.rectangle_coordinates[1].x;
      let y1 = item.rectangle_coordinates[0].y;
      let y2 = item.rectangle_coordinates[2].y;

      if (
        x1 < x2Layer &&
        x2 > x1Layer &&
        y1 < y2Layer &&
        y2 > y1Layer &&
        item.id != layer.id
      ) {
        layerIntersect.push(item);
      }
    });
    return layerIntersect.sort((a, b) => a.zIndex - b.zIndex);
  };

  const increaseZindex = (layer) => {
    let sortZindex = intersect(layer).filter(
      (item) => item.zIndex > layer.zIndex
    );
    let layerBack1 = sortZindex[0];
    let layerBack2 = sortZindex[1];
    if (!layerBack1) {
      return layer.zIndex;
    }
    if (!layerBack2) {
      return ++TopZindex.current;
    }
    return (layerBack2.zIndex + layerBack1.zIndex) / 2;
  };

  const decreaseZindex = (layer) => {
    let sortZindex = intersect(layer).filter(
      (item) => item.zIndex < layer.zIndex
    );
    let layerBack1 = sortZindex[sortZindex.length - 1];
    let layerBack2 = sortZindex[sortZindex.length - 2];
    if (!layerBack1) {
      return layer.zIndex;
    }
    if (!layerBack2) {
      return --LastZindex.current;
    }
    return (layerBack2.zIndex + layerBack1.zIndex) / 2;
  };

  const handleArrange = (type) => {
    if (!selectedText) {
      message.warning(ChooseLayer);
      return;
    }
    let newZindex = TopZindex.current;
    switch (type) {
      case "top":
        newZindex = ++TopZindex.current;
        break;
      case "bottom":
        newZindex = --LastZindex.current;
        break;
      case "increase":
        newZindex = increaseZindex(selectedText);
        break;
      case "decrease":
        newZindex = decreaseZindex(selectedText);
        break;

      default:
        break;
    }
    let indexSelect = -1; // find Index of select text to update textData array
    for (let i = 0; i < textData.length; i++) {
      if (textData[i].id == selectedText.id) {
        indexSelect = i;
        break;
      }
    }
    let newTextData = [...textData]; // copy textData because textData is state
    let newSelectText = {
      ...selectedText,
      zIndex: newZindex,
    };
    newTextData[indexSelect] = newSelectText;
    setSelectText(newSelectText);
    setTextData(newTextData);
    setHistory({ textData: newTextData });
  };

  const handleFlips = (type) => {
    if (!selectedText) {
      message.warning(ChooseLayer);
      return;
    }
    let newSelectText = {
      ...selectedText,
    };
    switch (type) {
      case "horizontal":
        newSelectText = {
          ...selectedText,
          flipX: !selectedText.flipX,
        };
        break;
      case "vertical":
        newSelectText = {
          ...selectedText,
          flipY: !selectedText.flipY,
        };
        break;
      default:
        break;
    }

    let indexSelect = -1; // find Index of select text to update textData array
    for (let i = 0; i < textData.length; i++) {
      if (textData[i].id == selectedText.id) {
        indexSelect = i;
        break;
      }
    }
    let newTextData = [...textData]; // copy textData because textData is state
    newTextData[indexSelect] = newSelectText;
    setSelectText(newSelectText);
    setTextData(newTextData);
    setHistory({ textData: newTextData });
  };
  const SHORTCUTDATA = [
    {
      key: "alt+a",
      function: () => handleALign("left"),
    },
    {
      key: "alt+h",
      function: () => handleALign("center"),
    },
    {
      key: "alt+d",
      function: () => handleALign("right"),
    },
    {
      key: "alt+w",
      function: () => handleALign("top"),
    },
    {
      key: "alt+v",
      function: () => handleALign("middle"),
    },
    {
      key: "alt+s",
      function: () => handleALign("bottom"),
    },
    {
      key: "[",
      function: () => handleArrange("bottom"),
    },
    {
      key: "]",
      function: () => handleArrange("top"),
    },
    {
      key: "ctrl+[",
      function: () => handleArrange("increase"),
    },
    {
      key: "ctrl+]",
      function: () => handleArrange("decrease"),
    },
    {
      key: "shift+h",
      function: () => handleFlips("horizontal"),
    },
    {
      key: "shift+v",
      function: () => handleFlips("vertical"),
    },
  ];
  return (
    <div>
      {SHORTCUTDATA.map((item, index) => (
        <ReactShortcut
          key={index}
          keys={item.key}
          onKeysPressed={(e) => {
            item.function();
          }}
        />
      ))}
      <Row className={styles.flex} gutter={8}>
        <Col span={3}>
          <img
            src={`${publicRuntimeConfig.basePath}/icons/toolbar/EditText/Align/Align-Left.svg`}
            onClick={() => handleALign("left")}
          />
        </Col>
        <Col span={3}>
          <img
            src={`${publicRuntimeConfig.basePath}/icons/toolbar/EditText/Align/Align-Center.svg`}
            onClick={() => handleALign("center")}
          />
        </Col>
        <Col span={3}>
          <img
            src={`${publicRuntimeConfig.basePath}/icons/toolbar/EditText/Align/Align-Right.svg`}
            onClick={() => handleALign("right")}
          />
        </Col>

        <Col span={3}>
          <img
            src={`${publicRuntimeConfig.basePath}/icons/toolbar/EditText/Align/Align-Top.svg`}
            onClick={() => handleALign("top")}
          />
        </Col>
        <Col span={3}>
          <img
            src={`${publicRuntimeConfig.basePath}/icons/toolbar/EditText/Align/Baseline.svg`}
            onClick={() => handleALign("middle")}
          />
        </Col>
        <Col span={3}>
          <img
            src={`${publicRuntimeConfig.basePath}/icons/toolbar/EditText/Align/Align-Bottom.svg`}
            onClick={() => handleALign("bottom")}
          />
        </Col>

        <Col span={3}>
          <img
            src={`${publicRuntimeConfig.basePath}/icons/toolbar/EditText/Align/Center-Vertical.svg`}
          />
        </Col>
        <Col span={3}>
          <img
            src={`${publicRuntimeConfig.basePath}/icons/toolbar/EditText/Align/Center-Horizontal.svg`}
          />
        </Col>
      </Row>
      <Row className={styles.flex} gutter={8}>
        <Col span={3}>
          <img
            src={`${publicRuntimeConfig.basePath}/icons/toolbar/EditText/Align/HightLight-Bottom.svg`}
            onClick={() => handleArrange("bottom")}
          />
        </Col>
        <Col span={3}>
          <img
            src={`${publicRuntimeConfig.basePath}/icons/toolbar/EditText/Align/HightLight-Top.svg`}
            onClick={() => handleArrange("top")}
          />
        </Col>

        <Col span={3}>
          <img
            src={`${publicRuntimeConfig.basePath}/icons/toolbar/EditText/Align/Light-Bottom.svg`}
            onClick={() => handleArrange("increase")}
          />
        </Col>
        <Col span={3}>
          <img
            src={`${publicRuntimeConfig.basePath}/icons/toolbar/EditText/Align/Light-Top.svg`}
            onClick={() => handleArrange("decrease")}
          />
        </Col>

        <Col span={3}>
          <img
            src={`${publicRuntimeConfig.basePath}/icons/toolbar/EditText/Align/Light-Horizontal.svg`}
            onClick={() => handleFlips("horizontal")}
          />
        </Col>
        <Col span={3}>
          <img
            src={`${publicRuntimeConfig.basePath}/icons/toolbar/EditText/Align/Light-Vertical.svg`}
            onClick={() => handleFlips("vertical")}
          />
        </Col>
      </Row>
    </div>
  );
};

export default EditAlign;
