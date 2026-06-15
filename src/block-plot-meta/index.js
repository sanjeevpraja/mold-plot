import { registerBlockType } from "@wordpress/blocks";
import { useBlockProps, InspectorControls } from "@wordpress/block-editor";
import { PanelBody, SelectControl } from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { useSelect } from "@wordpress/data";

import "./editor.scss";
import "./style.scss";

registerBlockType("mold/plot-meta", {
  title: __("Plot Meta", "mold-plot"),
  description: __("Display meta value for post type plot", "mold-plot"),
  icon: {
    src: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <path d="M13.1914 13.0127C13.1914 13.1263 13.1627 13.2349 13.1035 13.3379C13.0455 13.4409 12.9586 13.5247 12.8438 13.5898C12.7301 13.6549 12.5905 13.6875 12.4248 13.6875C12.2579 13.6875 12.1196 13.6505 12.0107 13.5771C11.9033 13.5026 11.8496 13.3925 11.8496 13.2471C11.8496 13.1407 11.8779 13.0566 11.9346 12.9951C11.9926 12.9324 12.0686 12.8853 12.1621 12.8545C12.2568 12.8226 12.3589 12.7994 12.4678 12.7852C12.5127 12.7792 12.5716 12.7729 12.6436 12.7646C12.7169 12.7552 12.7923 12.7442 12.8691 12.7324C12.947 12.7194 13.0152 12.704 13.0742 12.6875C13.1346 12.6697 13.1736 12.6502 13.1914 12.6289V13.0127Z" />
        <path d="M7.93262 11.6133C8.08413 11.6133 8.21588 11.6489 8.32715 11.7188C8.4393 11.7885 8.52565 11.8835 8.58594 12.0039C8.64747 12.1246 8.67869 12.2622 8.67871 12.416H7.12598C7.13398 12.2896 7.16496 12.1701 7.2207 12.0576C7.28573 11.9264 7.37848 11.8199 7.49902 11.7383C7.62095 11.6554 7.76571 11.6133 7.93262 11.6133Z" />
        <path d="M8 4.40039C8.20611 4.40039 8.38248 4.47831 8.5293 4.63477C8.67617 4.79143 8.75 4.9802 8.75 5.2002C8.74996 5.42011 8.67613 5.60803 8.5293 5.76465C8.38242 5.92131 8.20625 6 8 6C7.79375 6 7.61758 5.92131 7.4707 5.76465C7.32387 5.60803 7.25004 5.42011 7.25 5.2002C7.25 4.9802 7.32383 4.79143 7.4707 4.63477C7.61752 4.47831 7.79389 4.40039 8 4.40039Z" />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M13 0C14.6569 0 16 1.34315 16 3V13C16 14.6569 14.6569 16 13 16H3C1.34315 16 0 14.6569 0 13V3C0 1.34315 1.34315 0 3 0H13ZM12.6025 11.2373C12.4653 11.2373 12.3255 11.2561 12.1836 11.2939C12.0428 11.3306 11.9125 11.3958 11.793 11.4893C11.6747 11.5815 11.5798 11.7105 11.5088 11.876L11.9062 12.0186C11.9524 11.9191 12.0328 11.8259 12.1465 11.7383C12.26 11.6508 12.4164 11.6065 12.6162 11.6064C12.809 11.6064 12.9532 11.655 13.0479 11.752C13.1437 11.849 13.1913 11.9851 13.1914 12.1602V12.1748C13.1914 12.2421 13.1675 12.2892 13.1191 12.3164C13.0718 12.3436 12.9958 12.3632 12.8916 12.375C12.7886 12.3857 12.6539 12.4016 12.4883 12.4229C12.3618 12.4394 12.2357 12.4628 12.1104 12.4912C11.9862 12.5184 11.8724 12.5596 11.7695 12.6152C11.6666 12.6709 11.584 12.7475 11.5225 12.8457C11.461 12.9427 11.4307 13.0695 11.4307 13.2256C11.4307 13.4031 11.4718 13.5552 11.5547 13.6807C11.6375 13.8049 11.7498 13.8996 11.8906 13.9658C12.0315 14.0309 12.1885 14.0635 12.3613 14.0635C12.5196 14.0634 12.6537 14.0404 12.7637 13.9932C12.8738 13.9458 12.962 13.8878 13.0283 13.8203C13.0946 13.7529 13.1425 13.69 13.1709 13.6309H13.1914V14H13.6113V12.2031C13.6113 11.9865 13.5749 11.8136 13.5039 11.6846C13.4329 11.5557 13.3439 11.4594 13.2363 11.3955C13.1298 11.3316 13.0191 11.2897 12.9043 11.2695C12.7907 11.2482 12.6901 11.2373 12.6025 11.2373ZM7.93262 11.2373C7.68642 11.2373 7.47078 11.2972 7.28613 11.418C7.10266 11.5375 6.95943 11.7047 6.85645 11.9189C6.7547 12.1319 6.70416 12.3781 6.7041 12.6572C6.7041 12.9365 6.75471 13.1819 6.85645 13.3926C6.95939 13.602 7.10562 13.7656 7.29492 13.8828C7.4855 13.9988 7.7128 14.0566 7.97559 14.0566C8.1601 14.0566 8.32674 14.0285 8.47461 13.9717C8.62225 13.9138 8.74621 13.8332 8.84668 13.7305C8.94721 13.6264 9.0189 13.5053 9.06152 13.3682L8.65723 13.2539C8.62172 13.3486 8.57096 13.4283 8.50586 13.4922C8.4408 13.5548 8.36331 13.6019 8.27344 13.6338C8.18475 13.6645 8.08553 13.6806 7.97559 13.6807C7.80631 13.6807 7.65714 13.6437 7.5293 13.5703C7.40155 13.4957 7.30166 13.3871 7.22949 13.2451C7.16516 13.1153 7.13198 12.9597 7.12598 12.7783H9.10449V12.6006C9.10447 12.3462 9.07038 12.132 9.00293 11.958C8.93547 11.7841 8.84504 11.6444 8.73145 11.5391C8.61788 11.4326 8.4919 11.3559 8.35352 11.3086C8.21502 11.2612 8.07466 11.2373 7.93262 11.2373ZM9.92676 11.2725H9.51465V11.6279H9.92676V13.332C9.92676 13.4906 9.96372 13.6224 10.0371 13.7266C10.1117 13.8306 10.205 13.9081 10.3174 13.959C10.4309 14.0098 10.5468 14.0351 10.665 14.0352C10.743 14.0352 10.8075 14.0294 10.8584 14.0176C10.9093 14.0069 10.9491 13.996 10.9775 13.9854L10.8926 13.6094C10.8748 13.6129 10.8509 13.6181 10.8213 13.624C10.7918 13.6287 10.754 13.6309 10.708 13.6309C10.6465 13.6309 10.5878 13.6214 10.5322 13.6025C10.4779 13.5825 10.4329 13.5432 10.3975 13.4854C10.3631 13.4262 10.3457 13.3371 10.3457 13.2188V11.6279H10.9277V11.2725H10.3457V10.6191H9.92676V11.2725ZM2.44043 14H2.85254V11.2373H2.8877L4.02441 14H4.42188L5.55859 11.2373H5.59375V14H6.00586V10.3633H5.48047L4.24414 13.3818H4.20215L2.96582 10.3633H2.44043V14ZM8 2C7.20625 2 6.50742 2.29632 5.9043 2.88965C5.30119 3.48298 5 4.28029 5 5.28027C5.00007 5.94686 5.24832 6.67186 5.74512 7.45508C6.24199 8.23841 6.99375 9.08667 8 10C9.00625 9.08667 9.75801 8.23841 10.2549 7.45508C10.7517 6.67186 10.9999 5.94686 11 5.28027C11 4.28029 10.6988 3.48298 10.0957 2.88965C9.49258 2.29632 8.79375 2 8 2Z"
        />
      </svg>
    ),
  },
  attributes: {
    fallback: {
      type: "string",
      default: "--",
    },
    metaKey: {
      type: "string",
      default: "_plot_x",
    },
  },
  edit: ({ attributes, setAttributes }) => {
    const { fallback, metaKey } = attributes;

    // Available HTML tags
    const htmlTags = [
      { label: "Paragraph", value: "p" },
      { label: "Heading 1", value: "h1" },
      { label: "Heading 2", value: "h2" },
      { label: "Heading 3", value: "h3" },
      { label: "Heading 4", value: "h4" },
      { label: "Heading 5", value: "h5" },
      { label: "Heading 6", value: "h6" },
      { label: "Div", value: "div" },
      { label: "Span", value: "span" },
    ];

    // Define available meta keys
    const metaKeys = [
      { label: __("Longitude", "mold-plot"), value: "plot_x" },
      { label: __("Latitude", "mold-plot"), value: "plot_y" },
    ];

    // Get the current post's meta data based on selected metaKey
    const plotMetaValue = useSelect(
      (select) => {
        const meta = select("core/editor").getEditedPostAttribute("meta");
        // Add underscore prefix to match your meta key pattern
        return meta ? meta[`_${metaKey}`] : "";
      },
      [metaKey],
    );

    const blockProps = useBlockProps({
      className: "wp-mold-plot-meta",
    });

    // Display content in editor
    const displayContent =
      plotMetaValue || fallback || __("No value set", "mold-plot");

    return (
      <>
        <InspectorControls>
          <PanelBody
            title={__("Content Settings", "mold-plot")}
            initialOpen={true}>
            <SelectControl
              label={__("Meta Field", "mold-plot")}
              value={metaKey}
              options={[
                { label: __("Select a meta field", "mold-plot"), value: "" },
                ...metaKeys,
              ]}
              onChange={(newMetaKey) => setAttributes({ metaKey: newMetaKey })}
            />
          </PanelBody>
        </InspectorControls>
        <>
          {(() => {
            switch (metaKey) {
              case "plot_x":
                return (
                  <div className="wp-mold-plot-meta" {...blockProps}>
                    <htmlTag className="wp-mold-plot-meta-info">
                      {__("Longitude", "mold-plot")}
                    </htmlTag>
                    <div>
                      <small>
                        {__("Meta key:", "mold-plot")} <code>_{metaKey}</code>
                      </small>
                    </div>
                  </div>
                );
              case "plot_y":
                return (
                  <div className="wp-mold-plot-meta" {...blockProps}>
                    <htmlTag className="wp-mold-plot-meta-info">
                      {__("Latitude", "mold-plot")}
                    </htmlTag>
                    <div>
                      <small>
                        {__("Meta key:", "mold-plot")} <code>_{metaKey}</code>
                      </small>
                    </div>
                  </div>
                );
              default:
                return (
                  <div className="wp-mold-plot-meta" {...blockProps}>
                    <htmlTag className="wp-mold-plot-meta-info">
                      {displayContent}
                    </htmlTag>
                    <div>
                      <small>
                        {__("Meta key:", "mold-plot")} <code>_{metaKey}</code>
                      </small>
                    </div>
                  </div>
                );
            }
          })()}
        </>
      </>
    );
  },
  save: () => null,
});
