// <copyright company="Cloud Software Group, Inc.">
//   Copyright © 2011 - 2023 Cloud Software Group, Inc.
// All rights reserved.
// This software is the confidential and proprietary information
// of Cloud Software Group, Inc. ("Confidential Information"). You shall not
// disclose such Confidential Information and may not use it in any way,
// absent an express written license agreement between you and
// Cloud Software Group, Inc. that authorizes such use.
// </copyright>

(function()
{
    /**
      * Find a valid background for a node. Goes recursively up the tree.
      * @param {Object} elem - A pure dom node
      * @returns {String} - A rgba color
      */
    function validBackground(elem)
    {
        if (!elem.parentNode)
        {
            // We are at document level. Return a default value.
            return "rgb(255, 255, 255)"; // White
        }

        var style = window.getComputedStyle(elem);
        var background = style.getPropertyValue("background-color");
        if (background === "rgba(0, 0, 0, 0)")
        {
            return validBackground(elem.parentNode);
        }

        return background;
    }

    /**
     * Helper function that filters a list. Is more performant than native version
     * @param {Array} arr
     * @param {Function} fn
     * @returns {Array} - Retturns a new array with filtered values
     */
    function filter(arr, fn)
    {
        var value, i, results = [];
        for (i = 0; i < arr.length; i += 1)
        {
            value = arr[i];
            if (fn(value, i))
            {
                results.push(value);
            }
        }
        return results;
    }

    /**
     * Helper function to map arrays. Is more performant than native version
     * @param {Array} arr
     * @param {Function} fn
     * @returns {Array} - Returns a new array with transformed values
     */
    function loop(arr, fn)
    {
        var value, i, results = [];
        for (i = 0; i < arr.length; i += 1)
        {
            value = arr[i];
            results.push(fn(value, i));
        }
        return results;
    }

    /**
    * Apply wordwrap class to all elements with overflow text
    * @param {object} elems - DOM node list of elements
    */
    var applyWordWrap = function (elems, transparentHover)
    {
        // Extract available element height and font size and then apply max-height styling
        var measuredElements = loop(Array.prototype.slice.call(elems, 0), function (elem)
        {
            var style = window.getComputedStyle(elem);
            return {
                node: elem,
                height: elem.parentNode.clientHeight,
                background: validBackground(elem.parentNode),
                fontSize: parseInt(style.getPropertyValue("font-size"), 10),
                lineHeight: parseInt(style.getPropertyValue("line-height"), 10)
            };
        });

        loop(measuredElements, function (elemData)
        {
            var maxHeight = Math.floor(elemData.height / elemData.lineHeight) * elemData.lineHeight;
            elemData.node.style.maxHeight = maxHeight + "px";
            elemData.node.classList.add("sf-element-text-overflow-check");
        });

        var elementsWithOverFlow = filter(measuredElements, function (elemData)
        {
            // -1 is a fix for TSWP-10136. In Firefox the scrollHeight calculation is off by one pixel.
            // The calculation can be done by inserting an element with 100% height but that requires an
            // extra round of layout calculations and this function is already on a tight performance budget.
            return elemData.node.clientHeight < elemData.node.scrollHeight - 1;
        });

        // Apply overflow class on elements with hidden content
        loop(elementsWithOverFlow, function (elem)
        {
            var ellipsis = document.createElement("div");
            ellipsis.classList.add("sf-element-text-ellipsis");
            if (transparentHover)
            {
                ellipsis.classList.add("sf-element-text-ellipsis-hover");
            }

            ellipsis.innerHTML = "&hellip;";
            ellipsis.style.backgroundImage = "linear-gradient(to right, rgba(255, 255, 255, 0), " + elem.background + ", " + elem.background + ")";
            elem.node.classList.add("sf-element-text-overflow");
            elem.node.appendChild(ellipsis);
        });
    };

    /**
    * Rotate a set of dom nodes
    * This function is split up into four sections to reduce the number of forced reflows needed to rotate all cells.
    * @param {Array} elements - Node list of elements
    * @param {Number} angle - Number of degrees to tilt the text
    */
    function rotateCells(elements, angle)
    {
        // This Factor is an approximation of the text descender height
        var descentFactor = (11 / 2.68 + 20 / 6.57) / 2;

        // Convert DOM node list into array to handle forEach
        elements = Array.prototype.slice.call(elements, 0);
        if (!elements.length)
        {
            return;
        }

        angle = angle || 90;

        // Removing the identifier class to reduce extra calls for already rendered cells
        elements.forEach(function (elem)
        {
            elem.classList.remove("textOrientationDirection-vertical");
        });

        // Start by wrapping each cell in a div (Reading and writing)
        elements.forEach(function (elem)
        {
            var classes = elem.getAttribute("class") || "";
            var rotationCell = document.createElement("div");
            rotationCell.setAttribute("class", classes.replace("sf-element-table-cell", "") + " sf-element-rotated-cell");

            // Element can contain sorting arrow
            var childCount = elem.childElementCount;
            rotationCell.appendChild(elem.firstChild);
            if (childCount > 1)
            {
                elem.insertBefore(rotationCell, elem.children[0]); // Insert before the sorting arrow
            }
            else
            {
                elem.appendChild(rotationCell);
            }

        });

        var findClass = function (array, className)
        {
            var i;
            for (i = 0; i < array.length; i++)
            {
                if (array[i] === className)
                {
                    return i;
                }
            }

            return -1;
        };

        var rotateAlignment = function (classes)
        {
            var sourceArray = classes.split(" ");
            var targetArray = classes.split(" ");

            // Replace flex-justify with flex-align
            var index = findClass(sourceArray, "flex-justify-start");
            if (index !== -1)
            {
                targetArray[index] = "flex-align-start";
            }

            index = findClass(sourceArray, "flex-justify-end");
            if (index !== -1)
            {
                targetArray[index] = "flex-align-end";
            }

            index = findClass(sourceArray, "flex-justify-center");
            if (index !== -1)
            {
                targetArray[index] = "flex-align-center";
            }

            // Replace flex-align with flex-justify
            index = findClass(sourceArray, "flex-align-start");
            if (index !== -1)
            {
                targetArray[index] = "flex-justify-end";
            }

            index = findClass(sourceArray, "flex-align-end");
            if (index !== -1)
            {
                targetArray[index] = "flex-justify-start";
            }

            index = findClass(sourceArray, "flex-align-center");
            if (index !== -1)
            {
                targetArray[index] = "flex-justify-center";
            }

            return targetArray.join(" ");
        };

        // Calculate the size of each cell (Reading only)
        elements.forEach(function (elem)
        {
            var style = window.getComputedStyle(elem);
            var fontSize = style.getPropertyValue("font-size");
            var justifyContent = style.getPropertyValue("justify-content");
            var alignItems = style.getPropertyValue("align-items");
            var paddingTop = parseInt(style.getPropertyValue("padding-top"), 10);
            var paddingBottom = parseInt(style.getPropertyValue("padding-bottom"), 10);
            var paddingLeft = parseInt(style.getPropertyValue("padding-left"), 10);
            var paddingRight = parseInt(style.getPropertyValue("padding-right"), 10);

            var classes = elem.firstChild.className;

            // Visually adjusted descent value
            var descent = parseFloat(fontSize) / descentFactor - 1;
            var width = elem.offsetWidth - paddingLeft - paddingRight;
            var height = elem.offsetHeight - paddingTop - paddingBottom;

            var classesTarget = rotateAlignment(classes);

            // Switch the alignments    
            var temp = alignItems;
            alignItems = justifyContent;
            justifyContent = temp;

            // Reverse the alignment
            if (justifyContent === "flex-start")
            {
                justifyContent = "flex-end";
            }
            else if (justifyContent === "flex-end")
            {
                justifyContent = "flex-start";
            }

            // Append dimensions property on the dom node
            elem.dimensions = {
                paddingLeft: paddingLeft,
                paddingTop: paddingTop,
                width: width,
                height: height,
                descent: descent,
                className: classesTarget,
                justifyContent: justifyContent,
                alignItems: alignItems
            };
        });

        // Add a css transform to each cell (Writing to the DOM)
        elements.forEach(function (elem)
        {
            var child = elem.firstChild;
            var dimensions = elem.dimensions;

            var value = "rotate(-" + angle + "deg) " +
                "translateX( " + (-(dimensions.height - dimensions.descent)) + "px)";

            var textAlign = "";
            if (dimensions.justifyContent === "flex-start")
            {
                textAlign = "left";
            }
            else if (dimensions.justifyContent === "center")
            {
                textAlign = "center";
            }
            else if (dimensions.justifyContent === "flex-end")
            {
                textAlign = "right";
            }

            child.style.top = dimensions.paddingTop + "px";
            child.style.left = dimensions.paddingLeft + "px";
            child.style.webkitTransform = value;
            child.style.transform = value;
            child.style.transformOrigin = "top left";

            //child.style.justifyContent = dimensions.justifyContent;
            ///child.style.alignItems = dimensions.alignItems;
            child.firstChild.style.textAlign = textAlign;

            // width becomes height and height becomes width
            child.style.height = dimensions.width + "px";
            child.style.width = (dimensions.height - dimensions.descent) + "px";

            child.className = dimensions.className;
        });
    }

    /**********************************************************************************************************
      * Apply word wrap and rotate on table cells.
   
      */
    function processTableCells()
    {
        rotateCells(document.querySelectorAll(".textOrientationDirection-vertical"));
        applyWordWrap(document.querySelectorAll(".sfc-wrap .cell-text:not(.sf-element-text-overflow-check)"));
    }

    window.addEventListener("load", processTableCells);
}());