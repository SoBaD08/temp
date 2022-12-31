import { publicRuntimeConfig } from "@/next.config";
import { Col, Divider, InputNumber, Row, Select, Slider } from "antd";
import { RichUtils } from "draft-js";
import { useEffect, useMemo, useState } from "react";
import { capitalizeFirstLetter, convertNumber } from "src/common/helper";
import {
  ALIGN_TEXT,
  LIST_FONT_FAMILY,
  LIST_FONT_SIZE,
} from "../../../../common/const";
import { useTextData } from "../../../../common/TextData";
import styles from "./editText.module.scss";
const RichText = () => {
  const {
    textData,
    setTextData,
    editText,
    styleMap,
    setEditText,
    setStyleMap,
    selectedText,
  } = useTextData();
  const [state, _setState] = useState({
    editing: false,
    align: "left",
    editText: "",
    color: "#FF1F47",
    lineHeight: 1.5,
    letterSpacing: 1,
    opacity: 100,
    WebkitTextStrokeWidth: 0.5,
  });
  const setState = (data = {}) => {
    _setState((prevState) => ({
      ...prevState,
      ...data,
    }));
  };

  const [color, setColor] = useState();
  const [colorBorder, setColorBorder] = useState();
  const [styleSelect, setStyleSelect] = useState({
    font: "Arial",
    size: 14,
    letterSpacing: 1,
    lineHeight: 1.5,
    color: color || "#000000",
    WebkitTextStrokeColor: colorBorder || "#000000",
  });

  const onChangeText = (newText) => {
    setEditText(newText);
  };
  const onEditInline = (attribute, value, name = null) => {
    let styleName = name ? name : `${attribute}_${value}`.toUpperCase();
    // in styleMap name attribute = "attribute_value"
    setStyleMap((prev) => {
      return {
        ...prev,
        [styleName]: { [attribute]: value },
      };
    });
    let newText = RichUtils.toggleInlineStyle(editText, styleName);
    onChangeText(newText);
  };

  const onEditBlock = (type) => () => {
    onChangeText(RichUtils.toggleBlockType(editText, type));
    if (type == state.align) {
      setState({ align: "left" });
    } else {
      setState({ align: type });
    }
  };

  const currentStyle = useMemo(() => {
    return editText?.getCurrentInlineStyle()
      ? Array.from(editText?.getCurrentInlineStyle())
      : [];
  }, [JSON.stringify(styleSelect), editText?.getCurrentInlineStyle()]);
  useEffect(() => {
    if (currentStyle && currentStyle.length) {
      const font = convertStyleValue(currentStyle, "FONTFAMILY");
      const size = convertStyleValue(currentStyle, "FONTSIZE");
      const lineHeight = convertStyleValue(currentStyle, "LINEHEIGHT");
      const letterSpacing = convertStyleValue(currentStyle, "LETTERSPACING");
      const color = convertStyleValue(currentStyle, "COLOR");
      const WebkitTextStrokeColor = convertStyleValue(
        currentStyle,
        "WEBKITTEXTSTROKECOLOR"
      );
      let newStyle = {
        font: font || "Arial",
        size: size || 14,
        lineHeight: lineHeight ? convertNumber(lineHeight) : 1.5,
        letterSpacing: letterSpacing ? convertNumber(letterSpacing) : 1,
        color: color || "#000000",
        WebkitTextStrokeColor: WebkitTextStrokeColor || "#000000",
      };
      setStyleSelect({
        ...newStyle,
      });
    }
  }, [JSON.stringify(currentStyle)]);

  const convertStyleValue = (currentStyle, attribute) => {
    const styleValue = currentStyle.findLast(
      (style) => style.indexOf(attribute) == 0
    );
    const value = styleValue
      ? styleValue.toLowerCase().slice(attribute.length + 1)
      : null;
    return value;
  };
  return (
    <>
      <Row gutter={[8, 8]} style={{ marginBottom: "12px" }}>
        <Col span={24}>
          <Select
            defaultValue={"Arial"}
            dropdownClassName={styles.optionSelect}
            className={styles.select}
            onSelect={(value) => {
              onEditInline("fontFamily", value);
              setStyleSelect({ font: value });
            }}
            value={
              styleSelect?.font ? capitalizeFirstLetter(styleSelect?.font) : ""
            }
          >
            {LIST_FONT_FAMILY.map((item) => {
              return (
                <Select.Option value={item} key={item}>
                  {item}
                </Select.Option>
              );
            })}
          </Select>
        </Col>

        <Col span={10}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "5px",
            }}
          >
            <div
              className={`${styles.icon} ${
                currentStyle.some((item) => item == "WEIGHT_BOLD")
                  ? styles.iconAction
                  : ""
              }`}
              onClick={() => onEditInline("fontWeight", `900`, "WEIGHT_BOLD")}
            >
              <b>B</b>
            </div>
            <div
              className={`${styles.icon} ${
                currentStyle.some((item) => item == "STYLE_ITALIC")
                  ? styles.iconAction
                  : ""
              }`}
              onClick={() =>
                onEditInline("fontStyle", `italic`, "STYLE_ITALIC")
              }
            >
              <i>I</i>
            </div>
            <div
              className={`${styles.icon} ${
                currentStyle.some((item) => item == "DECORATION_UNDERLINE")
                  ? styles.iconAction
                  : ""
              }`}
              onClick={() =>
                onEditInline(
                  "textDecoration",
                  `underline`,
                  "DECORATION_UNDERLINE"
                )
              }
            >
              <u>U</u>
            </div>
          </div>
        </Col>

        <Col span={14}>
          <Select
            defaultValue={14}
            dropdownClassName={styles.optionSelect}
            className={styles.select}
            onSelect={(value) => {
              onEditInline("fontSize", value);
              setStyleSelect({ size: value });
            }}
            value={styleSelect?.size}
          >
            {LIST_FONT_SIZE.map((item) => {
              return (
                <Select.Option value={item} key={item}>
                  {item}
                </Select.Option>
              );
            })}
          </Select>
        </Col>
      </Row>

      <Row style={{ marginBottom: "12px" }}>
        <Col span={7}>
          <div className={styles.wrapSpacing}>
            <img
              src={`${publicRuntimeConfig.basePath}/icons/toolbar/EditText/Font/letter-spacing.svg`}
              style={{ width: "24px", height: "24px" }}
            ></img>
            <InputNumber
              placeholder="000"
              value={Number(styleSelect.letterSpacing)}
              min={1}
              max={50}
              stringMode
              onChange={(value) => {
                onEditInline("letterSpacing", `${value}px`);
                setState({ letterSpacing: value });
                setStyleSelect({ letterSpacing: value });
              }}
            />
          </div>
        </Col>
        <Col span={7}>
          <div className={styles.wrapSpacing}>
            <img
              src={`${publicRuntimeConfig.basePath}/icons/toolbar/EditText/Font/line-spacing.svg`}
              style={{ width: "24px", height: "24px" }}
            ></img>
            <InputNumber
              placeholder="000"
              value={Number(styleSelect.lineHeight)}
              min={1}
              max={10}
              step={0.5}
              stringMode
              onChange={(value) => {
                onEditInline("lineHeight", value);
                setState({ lineHeight: value });
                setStyleSelect({ lineHeight: value });
              }}
            />
          </div>
        </Col>
        <Col span={10}>
          <div className={styles.wrapFlex}>
            {ALIGN_TEXT.map((item, index) => {
              return (
                <div
                  key={index}
                  className={`${state.align == item.name ? styles.active : ""}`}
                  onMouseDown={onEditBlock(item.name)}
                >
                  {item.image}
                </div>
              );
            })}
          </div>
        </Col>
      </Row>

      {/* <Row gutter={16} style={{ marginBottom: "12px" }}>
    {EDIT_TEXT.map((item, index) => {
      return (
        <Col className={styles.col5} key={index}>
          <div
            key={index}
            className={`${state.editText == item.name ? styles.active : ""}`}
            onMouseDown={(value) => onEditInline(item.attribute, item.value)}
          >
            {item.image}
          </div>
        </Col>
      );
    })}
  </Row> */}

      <Divider />

      <div className={styles.sliderCustom}>
        <div className={styles.text}>
          <span>Opacity</span>
          <span>{state.opacity}%</span>
        </div>
        <Slider
          tipFormatter={null}
          onChange={(value) => {
            setState({ opacity: value });
            onEditInline("opacity", value / 100);
          }}
          min={1}
          max={100}
          defaultValue={100}
        />
      </div>

      <Divider />

      <Row>
        <Col span={12}>
          <div
            className={styles.wrapFlex}
            style={{ gap: "8px", justifyContent: "unset" }}
          >
            <input
              value={styleSelect.color}
              type="color"
              onBlur={(e) => {
                setState({ color: color });
                onEditInline("color", color);
              }}
              onChange={(e) => setColor(e.target.value)}
              style={{
                border: "none",
                width: "24px",
                height: "24px",
              }}
            ></input>
            <span style={{ textTransform: "uppercase" }}>
              {styleSelect.color}
            </span>
          </div>
        </Col>
        <Col span={12}>
          <div className={styles.wrapSpacing}>
            <InputNumber
              value={100}
              min={0}
              max={100}
              step={1}
              stringMode
              formatter={(value) => (value ? `${value}%` : ``)}
              parser={(value) => value.replace("%", "")}
            />
          </div>
        </Col>
      </Row>

      <Divider />

      <Row style={{ marginBottom: "10px" }}>
        <Col span={12}>
          <div
            className={styles.wrapFlex}
            style={{ gap: "8px", justifyContent: "unset" }}
          >
            <label className="input-color-custom" htmlFor="custom-border">
              <input
                id="custom-border"
                type="color"
                value={styleSelect.WebkitTextStrokeColor}
                onChange={(e) => setColorBorder(e.target.value)}
                onBlur={(e) => {
                  setState({ WebkitTextStrokeColor: colorBorder });
                  onEditInline("WebkitTextStrokeColor", colorBorder);
                }}
                style={{
                  border: "none",
                  width: "24px",
                  height: "24px",
                }}
              ></input>
            </label>

            <span style={{ textTransform: "uppercase" }}>
              {styleSelect.WebkitTextStrokeColor}
            </span>
          </div>
        </Col>
        <Col span={12}>
          <div className={styles.wrapSpacing}>
            <InputNumber
              value={100}
              min={0}
              max={100}
              step={1}
              stringMode
              formatter={(value) => (value ? `${value}%` : ``)}
              parser={(value) => value.replace("%", "")}
              // onChange={(e) => setOpacity(e)}
              // onBlur={() => setState({ opacity: opacity / 100 })}
            />
          </div>
        </Col>
      </Row>

      <Row gutter={12}>
        <Col span={8}>
          <img
            src={`${publicRuntimeConfig.basePath}/icons/toolbar/EditText/Border/border-size.svg`}
          ></img>
          <InputNumber
            value={state.WebkitTextStrokeWidth}
            min={0}
            max={4}
            step={0.1}
            stringMode
            bordered={false}
            className={styles.noneHandler}
            style={{ width: "30px" }}
            onChange={(e) => {
              setState({ WebkitTextStrokeWidth: e });
              onEditInline("WebkitTextStrokeWidth", `${e}px`);
            }}
          />
        </Col>
        <Col span={9}>
          {/* <label htmlFor="dash" className={styles.inputBorder}>
        <span>Dash</span>
        <InputNumber
          id="dash"
          value={30}
          min={0}
          max={100}
          step={1}
          stringMode
          bordered={false}
          className={styles.noneHandler}
        // onChange={(e) => setOpacity(e)}
        // onBlur={() => setState({ opacity: opacity / 100 })}
        />
      </label> */}
        </Col>
        <Col span={9}>
          {/* <label htmlFor="gap" className={styles.inputBorder}>
        <span>Gap</span>
        <InputNumber
          id="gap"
          value={30}
          min={0}
          max={100}
          step={1}
          stringMode
          bordered={false}
          className={styles.noneHandler}
        // onChange={(e) => setOpacity(e)}
        // onBlur={() => setState({ opacity: opacity / 100 })}
        />
      </label> */}
        </Col>
      </Row>
      {/* <Divider />

  <Row style={{ marginBottom: "10px" }}>
    <Checkbox defaultChecked className={styles.wrapCheckbox}>
      Shadow
    </Checkbox>
  </Row>

  <Row style={{ marginBottom: "10px" }}>
    <Col span={12}>
      <div
        className={styles.wrapFlex}
        style={{ gap: "8px", justifyContent: "unset" }}
      >
        <input
          type="color"
          // onChange={(e) => setColor(e.target.value)}
          // onBlur={() => setState({ color: color })}
          style={{ border: "none", width: "24px", height: "24px" }}
        ></input>
        <span style={{ textTransform: "uppercase" }}>{state.color}</span>
      </div>
    </Col>
    <Col span={12}>
      <div className={styles.wrapSpacing}>
        <InputNumber
          value={100}
          min={0}
          max={100}
          step={1}
          stringMode
          formatter={(value) => (value ? `${value}%` : ``)}
          parser={(value) => value.replace("%", "")}
        // onChange={(e) => setOpacity(e)}
        // onBlur={() => setState({ opacity: opacity / 100 })}
        />
      </div>
    </Col>
  </Row>
  <Row gutter={[12, 4]}>
    <Col span={12} >
      <label htmlFor="shadowX" className={styles.inputBorder}>
        <span>X</span>
        <InputNumber
          id="shadowX"
          value={10}
          min={0}
          max={100}
          step={1}
          stringMode
          bordered={false}
          className={styles.noneHandler}
        // onChange={(e) => setOpacity(e)}
        // onBlur={() => setState({ opacity: opacity / 100 })}
        />
      </label>
    </Col>
    <Col span={12} >
      <label htmlFor="shadowBlur" className={styles.inputBorder}>
        <span>Blur</span>
        <InputNumber
          id="shadowBlur"
          value={0}
          min={0}
          max={100}
          step={1}
          stringMode
          bordered={false}
          className={styles.noneHandler}
        // onChange={(e) => setOpacity(e)}
        // onBlur={() => setState({ opacity: opacity / 100 })}
        />
      </label>
    </Col>
    <Col span={12} >
      <label htmlFor="shadowY" className={styles.inputBorder}>
        <span>Y</span>
        <InputNumber
          id="shadowY"
          value={10}
          min={0}
          max={100}
          step={1}
          stringMode
          bordered={false}
          className={styles.noneHandler}
        // onChange={(e) => setOpacity(e)}
        // onBlur={() => setState({ opacity: opacity / 100 })}
        />
      </label>
    </Col>
    <Col span={12} >
      <label htmlFor="shadowOffset" className={styles.inputBorder}>
        <span>Offset</span>
        <InputNumber
          id="shadowOffset"
          value={0}
          min={0}
          max={100}
          step={1}
          stringMode
          bordered={false}
          className={styles.noneHandler}
        // onChange={(e) => setOpacity(e)}
        // onBlur={() => setState({ opacity: opacity / 100 })}
        />
      </label>
    </Col>
  </Row> */}
    </>
  );
};

export default RichText;
