import { registerBlockType } from "@wordpress/blocks";
import {
  useBlockProps,
  InspectorControls,
  MediaUpload,
  MediaUploadCheck,
} from "@wordpress/block-editor";
import {
  PanelBody,
  TextControl,
  SelectControl,
  RangeControl,
} from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { useState, useEffect } from "@wordpress/element";
import { getPlotItemPositionStyle } from "../utils/plot-position";

import "./editor.scss";
import "./style.scss";

const updateCoordinate = (plotType, axis, value, setAttributes) => {
  let val = parseFloat(value);

  if (plotType === "image") {
    if (val < 0) val = 0;
    if (val > 100) val = 100;
  } else if (axis === "latitude") {
    if (val < -90) val = -90;
    if (val > 90) val = 90;
  } else {
    if (val < -180) val = -180;
    if (val > 180) val = 180;
  }

  setAttributes({
    [axis]: isNaN(val) ? null : val,
  });
};

registerBlockType("mold/plot-item", {
  icon: {
    src: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <path d="M10.0848 16.2128L10.4773 16.4803L10.8698 16.2128C11.077 16.0712 15.9546 12.6982 15.9546 8.33333C15.9546 5.3925 13.4975 3 10.4773 3C7.45707 3 5 5.3925 5 8.33333C5 12.6982 9.87684 16.0713 10.0848 16.2128ZM10.4773 4.33333C12.7421 4.33333 14.5852 6.12767 14.5852 8.33333C14.5852 11.3483 11.5738 13.9723 10.4773 14.8278C9.3808 13.9723 6.36932 11.3483 6.36932 8.33333C6.36932 6.12767 8.21191 4.33333 10.4773 4.33333ZM12.5313 8.33333C12.5313 7.2305 11.6099 6.33333 10.4773 6.33333C9.34468 6.33333 8.4233 7.2305 8.4233 8.33333C8.4233 9.43617 9.34468 10.3333 10.4773 10.3333C11.6099 10.3333 12.5313 9.43617 12.5313 8.33333ZM9.79262 8.33333C9.79262 7.96583 10.0995 7.66667 10.4773 7.66667C10.8547 7.66667 11.1619 7.96583 11.1619 8.33333C11.1619 8.70083 10.8547 9 10.4773 9C10.0995 9 9.79262 8.70083 9.79262 8.33333Z" />
      </svg>
    ),
  },

  attributes: {
    imageId: {
      type: "number",
      default: 0,
    },
    imageUrl: {
      type: "string",
      default: "",
    },
    thumbnailUrl: {
      type: "string",
      default: "",
    },
    imageAlt: {
      type: "string",
      default: "",
    },
    borderRadius: {
      type: "number",
      default: 0,
    },
    imageSize: {
      type: "number",
      default: 60,
    },
    latitude: {
      type: "number",
      default: null,
    },
    longitude: {
      type: "number",
      default: null,
    },
    tooltipDisplay: {
      type: "string",
      default: "show-always",
    },
    tooltipPosition: {
      type: "string",
      default: "top",
    },
    description: {
      type: "string",
      default: "Enter Text",
    },
    plotId: {
      type: "string",
      default: "",
    },
    plotType: {
      type: "string",
      default: "world-map",
    },
  },

  edit: ({ attributes, setAttributes, context }) => {
    const {
      imageId,
      imageUrl,
      thumbnailUrl,
      imageAlt,
      borderRadius,
      imageSize,
      latitude,
      longitude,
      tooltipDisplay,
      tooltipPosition,
      description,
      plotId,
      plotType,
    } = attributes;

    useEffect(() => {
      if (context["mold/plotType"] && context["mold/plotType"] !== plotType) {
        setAttributes({ plotType: context["mold/plotType"] });
      }
    }, [context["mold/plotType"]]);

    const showImageCoordinates = plotType === "image";
    const [plotOptions, setPlotOptions] = useState([]);

    useEffect(() => {
      wp.apiFetch({
        path: "/wp/v2/plot?per_page=100",
      })
        .then((posts) => {
          const options = posts.map((post) => ({
            label: post.title.rendered + (post.id ? ` (ID: ${post.id})` : ""),
            value: post.id.toString(),
          }));
          setPlotOptions(options);
        })
        .catch((error) => {
          console.error("Error fetching plot posts:", error);
        });
    }, []);

    useEffect(() => {
      if (imageId && imageId > 0) {
        wp.apiFetch({
          path: `/wp/v2/media/${imageId}`,
        })
          .then((media) => {
            const thumbnail =
              media.media_details?.sizes?.thumbnail?.source_url ||
              media.media_details?.sizes?.medium?.source_url ||
              media.source_url ||
              imageUrl;

            setAttributes({
              imageUrl: media.source_url,
              thumbnailUrl: thumbnail,
              imageAlt: media.alt_text || media.title.rendered || "",
            });
          })
          .catch((error) => {
            console.error("Error fetching media:", error);
          });
      }
    }, [imageId]);

    const handleImageChange = (newImage) => {
      const thumbnail =
        newImage.sizes?.thumbnail?.url ||
        newImage.sizes?.medium?.url ||
        newImage.url;

      setAttributes({
        imageId: newImage.id,
        imageUrl: newImage.url,
        thumbnailUrl: thumbnail,
        imageAlt: newImage.alt || "",
      });
    };

    const displayImageUrl = thumbnailUrl || imageUrl;

    const imageStyle = {
      "--border-radius": `${borderRadius}px`,
      "--width": `${imageSize}px`,
      "--height": `${imageSize}px`,
    };

    const tooltipDisplayClass =
      tooltipDisplay === "show-on-hover"
        ? "tooltip-show-on-hover"
        : "tooltip-show-always";
    const tooltipPositionClass = `tooltip-position-${tooltipPosition}`;

    const blockProps = useBlockProps({
      className: ["plot-item", tooltipDisplayClass, tooltipPositionClass].join(
        " ",
      ),
      style: getPlotItemPositionStyle(plotType, latitude, longitude),
    });

    const renderPlotPin = (open) => (
      <div
        className="plot-item-image"
        style={imageStyle}
        onClick={open}
        role="button">
        {displayImageUrl ? (
          <img src={displayImageUrl} alt={imageAlt} />
        ) : (
          <button
            type="button"
            className="btn-add-media"
            title={__("Add Image", "mold-plot")}>
            <span className="dashicons dashicons-plus" aria-hidden="true" />
          </button>
        )}

        {description && (
          <div className="plot-item-info">
            <div className="plot-description">{description}</div>
          </div>
        )}
      </div>
    );

    return (
      <>
        <InspectorControls>
          <PanelBody
            title={__("Plot Item Settings", "mold-plot")}
            initialOpen={true}>
            <TextControl
              label={__("Text", "mold-plot")}
              value={description}
              onChange={(newDescription) =>
                setAttributes({ description: newDescription })
              }
              help={__("Tooltip text shown above the pin.", "mold-plot")}
            />
            <SelectControl
              label={__("Tooltip Display", "mold-plot")}
              value={tooltipDisplay}
              options={[
                { label: __("Show always", "mold-plot"), value: "show-always" },
                {
                  label: __("Show on hover", "mold-plot"),
                  value: "show-on-hover",
                },
              ]}
              onChange={(value) => setAttributes({ tooltipDisplay: value })}
              help={__(
                "Choose whether the tooltip is always visible or only shown on hover.",
                "mold-plot",
              )}
            />
            <SelectControl
              label={__("Tooltip Position", "mold-plot")}
              value={tooltipPosition}
              options={[
                { label: __("Top", "mold-plot"), value: "top" },
                { label: __("Bottom", "mold-plot"), value: "bottom" },
                { label: __("Left", "mold-plot"), value: "left" },
                { label: __("Right", "mold-plot"), value: "right" },
              ]}
              onChange={(value) => setAttributes({ tooltipPosition: value })}
              help={__("Place the tooltip around the plot pin.", "mold-plot")}
            />
            {showImageCoordinates && (
              <>
                <RangeControl
                  label={__("Axis Y (%)", "mold-plot")}
                  value={latitude ?? 0}
                  onChange={(value) =>
                    updateCoordinate(plotType, "latitude", value, setAttributes)
                  }
                  placeholder={"0-100"}
                  type="number"
                  min={0}
                  max={100}
                  help={__("Top (0) to bottom (100).", "mold-plot")}
                />
                <RangeControl
                  label={__("Axis X (%)", "mold-plot")}
                  value={longitude ?? 0}
                  onChange={(value) =>
                    updateCoordinate(
                      plotType,
                      "longitude",
                      value,
                      setAttributes,
                    )
                  }
                  placeholder={"0-100"}
                  type="number"
                  min={0}
                  max={100}
                  help={__("Left (0) to right (100).", "mold-plot")}
                />
              </>
            )}

            {!showImageCoordinates && (
              <>
                <TextControl
                  label={__("Latitude", "mold-plot")}
                  value={latitude ?? ""}
                  onChange={(value) =>
                    updateCoordinate(plotType, "latitude", value, setAttributes)
                  }
                  placeholder={"e.g., 40.71"}
                  type="number"
                  min={-90}
                  max={90}
                  help={""}
                />
                <TextControl
                  label={__("Longitude", "mold-plot")}
                  value={longitude ?? ""}
                  onChange={(value) =>
                    updateCoordinate(
                      plotType,
                      "longitude",
                      value,
                      setAttributes,
                    )
                  }
                  placeholder={"e.g., -74.00"}
                  type="number"
                  min={-180}
                  max={180}
                  help={""}
                />
              </>
            )}

            <SelectControl
              label={__("Select Plot", "mold-plot")}
              value={plotId}
              options={[
                { label: __("Select a plot...", "mold-plot"), value: "" },
                ...plotOptions,
              ]}
              onChange={(value) => setAttributes({ plotId: value })}
              help={__(
                "Optional linked plot post for modal details.",
                "mold-plot",
              )}
            />
            <MediaUploadCheck>
              <MediaUpload
                onSelect={handleImageChange}
                allowedTypes={["image"]}
                value={imageId}
                render={({ open }) => (
                  <div>
                    {!displayImageUrl ? (
                      <button
                        type="button"
                        onClick={open}
                        className="components-button is-secondary"
                        style={{ marginBottom: "10px" }}>
                        {__("Select Image", "mold-plot")}
                      </button>
                    ) : (
                      <div>
                        <div>
                          <img
                            src={displayImageUrl}
                            alt={imageAlt}
                            style={{
                              maxWidth: "100%",
                              marginBottom: "10px",
                            }}
                          />
                        </div>
                        <div style={{ marginBottom: "10px" }}>
                          <button
                            type="button"
                            onClick={open}
                            className="components-button is-secondary"
                            style={{ marginRight: "10px" }}>
                            {__("Replace Image", "mold-plot")}
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setAttributes({
                                imageId: 0,
                                imageUrl: "",
                                thumbnailUrl: "",
                                imageAlt: "",
                              })
                            }
                            className="components-button is-link is-destructive">
                            {__("Remove Image", "mold-plot")}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              />
            </MediaUploadCheck>
            <RangeControl
              label={__("Border Radius", "mold-plot")}
              value={borderRadius}
              onChange={(value) => setAttributes({ borderRadius: value })}
              min={0}
              max={150}
              step={1}
            />
            <RangeControl
              label={__("Image Size", "mold-plot")}
              value={imageSize}
              onChange={(value) => setAttributes({ imageSize: value })}
              min={30}
              max={150}
              step={10}
            />
          </PanelBody>
        </InspectorControls>

        <div {...blockProps}>
          <MediaUploadCheck>
            <MediaUpload
              onSelect={handleImageChange}
              allowedTypes={["image"]}
              value={imageId}
              render={({ open }) => renderPlotPin(open)}
            />
          </MediaUploadCheck>
        </div>
      </>
    );
  },

  save: ({ attributes }) => {
    const {
      imageId,
      imageUrl,
      thumbnailUrl,
      imageAlt,
      borderRadius,
      imageSize,
      latitude,
      longitude,
      tooltipDisplay,
      tooltipPosition,
      description,
      plotId,
      plotType,
    } = attributes;

    const blockProps = useBlockProps.save({
      className: [
        "plot-item",
        tooltipDisplay === "show-on-hover"
          ? "tooltip-show-on-hover"
          : "tooltip-show-always",
        `tooltip-position-${tooltipPosition}`,
      ].join(" "),
      style: getPlotItemPositionStyle(plotType, latitude, longitude),
    });

    const displayImageUrl = thumbnailUrl || imageUrl;

    return (
      <div {...blockProps}>
        {displayImageUrl && (
          <div
            className="plot-item-image"
            style={{
              "--border-radius": `${borderRadius}px`,
              "--width": `${imageSize}px`,
              "--height": `${imageSize}px`,
            }}>
            {plotId && (
              <button
                className="plot-image-trigger"
                type="button"
                data-plot-id={plotId}
                aria-label={`View details for plot ${plotId}`}>
                <img src={displayImageUrl} alt={imageAlt} />
              </button>
            )}
            {!plotId && (
              <div className="plot-image-trigger">
                <img
                  src={displayImageUrl}
                  alt={imageAlt}
                  className={`plot-image-size-${imageSize}`}
                  data-image-id={imageId}
                />
              </div>
            )}

            {description && (
              <div className="plot-item-info">
                <div className="plot-description">{description}</div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  },
});
