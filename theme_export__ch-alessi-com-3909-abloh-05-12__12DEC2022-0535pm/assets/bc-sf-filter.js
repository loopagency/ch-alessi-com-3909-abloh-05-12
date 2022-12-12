/* eslint-disable */
var onSale = false;
var soldOut = false;
var priceVaries = false;
var images = [];
var firstVariant = {};
// Override Settings
var bcSfFilterSettings = {
    general: {
        limit: 24,
        breakpointMobile: "1024",
        /* Optional */
        loadProductFirst: false,
        collapseOnMobileByDefault: true,
        filterTreeMobileStyle: 'style2',
        suggestionMobileStyle: 'style2',
        sortingList: bcSfFilterConfig.custom.filters,
        rangeStyle: "style1",
        activeLoadPreviousPage: true,
      }
};
// Declare Templates
var bcSfFilterTemplate = {
  'selectFilterOptionButton': 'bc-sf-filter-select-button button button--secondary button--dark',
  'soldOutClass': ' sold-out',
  'saleClass': ' on-sale',
  // Grid Template
  'productGridItemHtml':
    '<div class="product-card" data-cy="productCard"' +
    'data-datalayer-id="datalayer_{{productHandleDataLayer}}"' +
    'data-datalayer-list="{{productListDataLayer}}"' +
    'js-product-link ' +
    'js-product-card >' +
      '<script class="bc-sf-filter-product-script" data-id="bc-product-json-{{itemId}}" type="application/json">{{itemJson}}</script>' +
      '<div class="product-card__badge-listing">{{itemLabels}}</div>' +
      '<a class="product-card__thumbnail-container {{hasHover}}" href="{{itemUrl}}">' +
        '{{itemImages}}' +
        '{{soldOutLabel}}' +
      '</a>' +
      '<div class="product-card__footer">' +
        '<span class="product-card__product-type caption">{{itemProductType}}</span>' +
        '<a href="{{itemUrl}}" class="product-card__title label">{{itemTitle}}</a>' +
        '{{itemPrice}}' +
        '{{itemVariant}}' +
      '</div>' +
      '<script>{{itemDataLayer}}</script>' +
    '</div>',
  'filterTreeMobileButton': '<button id="bc-sf-filter-tree-mobile-button" type="button">{{label}}</button>',
  'filterOptionWrapper': '<div class="{{class.filterOption}} {{blockTypeClass}} {{blockId}}" data-block-id="{{blockId}}"><div class="{{class.filterBlockTitle}}"><h3><span>{{blockTitle}}</span></h3>{{tooltip}}{{clearButton}}</div><div class="{{class.filterBlockContent}}"><div class="container">{{blockContent}}</div></div></div>',
  'filterOptionHorizontalWrapper': '<div class="{{class.filterOption}} {{blockTypeClass}} {{blockId}}" data-block-id="{{blockId}}"><div class="{{class.filterBlockTitle}}" id={{blockTitleId}}><a tabindex="0" role="button" aria-controls="{{blockContentId}}" aria-expanded="false" href="javascript:;"><span>{{blockTitle}}{{tooltip}}</span><div></div></a></div><div class="{{class.filterBlockContent}}" id={{blockContentId}}><div class="{{class.filterBlockContent}}-inner"><div class="container">{{blockContent}}{{btnApply}}{{clearButton}}</div></div></div></div>',
  'filterOptionRange': '<div class="bc-sf-filter-option-range"><div class="bc-sf-filter-option-range-amount" id="{{rangeAmountId}}"><input class="bc-sf-filter-option-range-amount-min" aria-label="Min Price" type="text" /><div class="bc-sf-filter-option-range-amount-split"> - </div><input class="bc-sf-filter-option-range-amount-max" aria-label="Max Price" type="text" /></div><div class="bc-sf-filter-option-range-slider {{itemSelected}}" id="{{rangeSliderId}}" data-id="{{itemParentId}}" data-value="{{itemValue}}" data-parent-label="{{itemParentLabel}}"></div></div>',
  'filterOptionRange2': '<div class="bc-sf-filter-option-range"><div class="bc-sf-filter-option-range-amount" id="{{rangeAmountId}}">{{itemLabel}}</div><div class="bc-sf-filter-option-range-slider {{itemSelected}}" id="{{rangeSliderId}}" data-id="{{itemParentId}}" data-value="{{itemValue}}" data-parent-label="{{itemParentLabel}}"></div></div>',
  // Pagination Template
  'previousActiveHtml': '<li><a href="{{itemUrl}}">&larr;</a></li>',
  'previousDisabledHtml': '<li class="disabled"><span>&larr;</span></li>',
  'nextActiveHtml': '<li><a href="{{itemUrl}}">&rarr;</a></li>',
  'nextDisabledHtml': '<li class="disabled"><span>&rarr;</span></li>',
  'pageItemHtml': '<li><a href="{{itemUrl}}">{{itemTitle}}</a></li>',
  'pageItemSelectedHtml': '<li><span class="active">{{itemTitle}}</span></li>',
  'pageItemRemainHtml': '<li><span>{{itemTitle}}</span></li>',
  'paginateHtml': '<ul>{{previous}}{{pageItems}}{{next}}</ul>',
  'btnLoadPreviousPageTemplate': '<div id="bc-sf-filter-btn-load-previous-page"><a href="javascript:void(0)" aria-label="{{loadPreviousPage}}" class="js-bc-sf-filter-btn-load-previous-page button button--dark button--primary button--large">{{loadPreviousPage}}</a></div>',
  'loadMoreButton': '<div id="bc-sf-filter-load-more-button-container"><a href="javascript:;" aria-label="{{labelLoadMore}}" class="bc-sf-filter-load-more-button button button--dark button--primary button--large">{{labelLoadMore}}</a></div>',
  // Sorting Template
  'sortingHtml': '<label class="body-2 boost__sorting-label" style="background-image: url(\''+ theme.urls.icon.chevron_down +'\')"><span><span>' + bcSfFilterConfig.label.sorting + '</span></span></label><ul class="bc-sf-filter-filter-dropdown">{{sortingItems}}</ul>',
  // Show Limit Template
  'showLimitHtml': '<label>' + bcSfFilterConfig.label.show_limit + '</label><select class="bc-sf-filter-filter-dropdown">{{showLimitItems}}</select>',
  // Breadcrumb Template
  'breadcrumbHtml': '<a href="/">' + bcSfFilterConfig.label.breadcrumb_home + '</a> {{breadcrumbDivider}} {{breadcrumbItems}}',
  'breadcrumbDivider': '<span class="divider">/</span>',
  'breadcrumbItemLink': '<a href="{{itemLink}}">{{itemTitle}}</a>',
  'breadcrumbItemSelected': '<span>{{itemTitle}}</span>',
};
/************************** CUSTOMIZE DATA BEFORE BUILDING PRODUCT ITEM **************************/
function prepareShopifyData(data) {
  // Displaying price base on the policy of Shopify, have to multiple by 100
  soldOut = !data.available; // Check a product is out of stock
  onSale = data.compare_at_price_min > buildMinimumPrice(data); // Check a product is on sale
  priceVaries = buildMinimumPrice(data) != data.price_max; // Check a product has many prices
  // Convert images to array
  images = data.images_info;
  // Get First Variant (selected_or_first_available_variant)
  var firstVariant = data['variants'][0];
  if (getParam('variant') !== null && getParam('variant') != '') {
    var paramVariant = data.variants.filter(function(e) {
      return e.id == getParam('variant');
    });
    if (typeof paramVariant[0] !== 'undefined') firstVariant = paramVariant[0];
  } else {
    for (var i = 0; i < data['variants'].length; i++) {
      if (data['variants'][i].available) {
        firstVariant = data['variants'][i];
        break;
      }
    }
  }
  return data;
}
/************************** END CUSTOMIZE DATA BEFORE BUILDING PRODUCT ITEM **************************/
/************************** BUILD PRODUCT LIST **************************/
// Build Product Grid Item
BCSfFilter.prototype.buildProductGridItem = function(data, index) {
  // Get Template
  var itemHtml = bcSfFilterTemplate.productGridItemHtml;
  var itemDataLayer =
    'var datalayer_'+data.handle.replace(/-/g, '_')+' = {'+
    'name: "'+data.title.replace(/-/g, '_')+'",'+
    'id: "'+data.id+'",'+
    'price: '+(buildMinimumPrice(data)/100)+','+
    'brand: "alessi",'+
    'category: "'+tagByName("category", data.tags)+'",'+
    'list: "'+listType()+'",'+
    'position: {{itemIndex}},'+
    'dimension15: "'+tagByName("macro_category", data.tags)+'"'+
  '};';

  // Customize API data to get the Shopify data
  data = prepareShopifyData(data);
  // Add Custom class
  var soldOutClass = soldOut ? bcSfFilterTemplate.soldOutClass : '';
  var saleClass = onSale ? bcSfFilterTemplate.saleClass : '';
  itemHtml = itemHtml.replace(/{{soldOutClass}}/g, soldOutClass);
  itemHtml = itemHtml.replace(/{{saleClass}}/g, saleClass);
  // Add Label
  itemHtml = itemHtml.replace(/{{itemLabels}}/g, buildLabels(data));
  itemHtml = itemHtml.replace(/{{soldOutLabel}}/g, buildLabelSoldOut());
  // Add Tagline
  itemHtml = itemHtml.replace(/{{itemTagline}}/g, buildTaglines(data));
  // Add Family
  itemHtml = itemHtml.replace(/{{itemProductType}}/g, buildProductType(data));
  // Add Images
  itemHtml = itemHtml.replace(/{{hasHover}}/g, hasHoverImages(data));
  itemHtml = itemHtml.replace(/{{itemImages}}/g, buildImages(data));
  // Add Price
  itemHtml = itemHtml.replace(/{{itemPrice}}/g, buildPrice(data));
  // Add Variants
  itemHtml = itemHtml.replace(/{{itemVariant}}/g, buildVariants(data));

  // Add data json
  var self = this;
  var itemJson = {
    "id": data.id,
    "title": data.title,
    "handle": data.handle,
    "vendor": data.vendor,
    "variants": data.variants,
    "url": self.buildProductItemUrl(data),
    "options_with_values": data.options_with_values,
    "images": data.images,
    "available": data.available,
    "price_min": buildMinimumPrice(data),
    "price_max": data.price_max,
    "compare_at_price_min": data.compare_at_price_min,
    "compare_at_price_max": data.compare_at_price_max,
    "compare_at_price": data.compare_at_price
  };
  itemHtml = itemHtml.replace(/{{itemJson}}/g, JSON.stringify(itemJson));

  // Add main attribute (Always put at the end of this function)
  itemHtml = itemHtml.replace(/{{itemId}}/g, data.id);
  itemHtml = itemHtml.replace(/{{itemTitle}}/g, data.title);
  itemHtml = itemHtml.replace(/{{itemHandle}}/g, data.handle);
  itemHtml = itemHtml.replace(/{{itemUrl}}/g, this.buildProductItemUrl(data));

  itemHtml = itemHtml.replace(/{{productHandleDataLayer}}/g, data.handle.replace(/-/g, '_'));
  itemHtml = itemHtml.replace(/{{productListDataLayer}}/g, listType());
  itemDataLayer = itemDataLayer.replace(/{{itemIndex}}/g, index);
  itemHtml = itemHtml.replace(/{{itemDataLayer}}/g, itemDataLayer);

  return itemHtml;
};

// Build Product List Item
BCSfFilter.prototype.buildProductListItem = function(data) {
};
/************************** END BUILD PRODUCT LIST **************************/
function buildImages(data) {
  var html = '';

  // Build Main Image
  var thumbUrl = images.length > 0
    ? bcsffilter.optimizeImage(images[0]['src'], '500x')
    : bcSfFilterConfig.general.no_image_url;

  html +=
    '<div class="responsive-card-image__wrapper product-card__thumbnail product-card__thumbnail--product">' +
      '<img class="responsive-card-image__image lazyload blur-up" src="' + thumbUrl + '" alt="' + data.title + '" />' +
    '</div>';
  // Build Image Swap
  if (images.length > 1) {
    var flipImageUrl = bcsffilter.optimizeImage(images[1]['src'], '500x');

    html +=
    '<div class="responsive-card-image__wrapper product-card__thumbnail product-card__thumbnail--lifestyle">' +
      '<img class="responsive-card-image__image lazyload blur-up" src="' + flipImageUrl + '" alt="' + data.title + '" />' +
    '</div>';
  }
  return html;
}

function hasHoverImages(data) {
  return (data.images.length > 1) ? '' : ' no-hover';
}

function buildMinimumPrice(data) {
  var minimumPrice = 999999;
  for(var i = 0; i < data.variants.length; i++) {
    var variantPrice = parseInt(data.variants[i].price);
    minimumPrice = (variantPrice !== 0 && variantPrice !== 0.00 && variantPrice < minimumPrice)
    ? variantPrice
    : minimumPrice;
  }

  return (minimumPrice !== 999999) ? minimumPrice : '';
}

function buildPrice(data) {
  var minimumPrice = buildMinimumPrice(data);
  var formattedMinimumPrice = (minimumPrice !== '') ? bcsffilter.formatMoney(minimumPrice) : '';

  var html = '<div class="product-price h6" js-recommended-products="productPrices">';
  if (onSale) {
    html += '<span class="visually-hidden">' + data.compare_at_price + '</span>'

    html += '<s data-price="' + data.compare_at_price_min + '" js-currency="price" js-product-form="comparePrice">' + bcsffilter.formatMoney(data.compare_at_price_min) + '</s> ';

    html += '<span class="color--brand" data-price="' + minimumPrice +'" js-currency="price" js-product-form="price">' + formattedMinimumPrice + '</span>';

  } else {
    if (priceVaries) {
      html += (bcSfFilterConfig.label_basic.from) + ' ';
    }
    html += '<span data-price="' + minimumPrice +'" js-currency="price" js-product-form="price">' + formattedMinimumPrice + '</span>';

  }
  html += '</div>';
  return html;
}

function buildLabels(data) {
  var badges = '';

  for(var i = 0; i < data.tags.length; i++) {
    var tag = data.tags[i];
    var tagHandle = tag.toLowerCase();

    if (tagHandle.indexOf("badge: ") !== -1) {
      tagHandle = tagHandle.replace("badge: ", "");
      if (tagHandle.length > 0 && tagHandle !== 'none') {
        tagHandle = tagHandle;
        badges +=
          '<div class="product-card__badge badge badge--white">' +
            '<span>' + tagHandle + '</span>' +
          '</div>';
      }
    }

    if (tag.indexOf("preorder") !== -1) {
      badges +=
      '<div class="product-card__badge badge badge--pre-order">' +
        '<span>' + theme.strings.preorder + '</span>' +
      '</div>';
    }
  }

  if(onSale) {
    var discount = (data.compare_at_price - data.price) / data.compare_at_price  * 100

    badges +=
    '<div class="product-card__badge badge badge--secondary">' +
      '<span>' + discount.toFixed() + '%' + ' ' + theme.strings.onSale  + '</span>' +
    '</div>';
  }

  return badges;
}

function buildLabelSoldOut() {
  return (soldOut)
  ? '<span class="product-card__soldout border--light color--secondary label">' + theme.strings.soldOut + '</span>'
  : ''
}

function buildTaglines(data) {
  var color = '';
  var model = '';

  for(var i = 0; i < data.tags.length; i++) {
    var tag = data.tags[i];

    if (tag.indexOf("parent_colour: ") !== -1) {
      color = tag.replace("parent_colour: ", "");
    }

    if (tag.indexOf("model: ") !== -1) {
      model = tag.replace("model: ", "");
    }
  }
  return (color.length > 0 && model.length > 0)
    ? color + ' / ' + model
    : color + model;
}

function buildProductType(data) {
  var description_tag = 'description_'+ window.Shopify.locale + ':';
  var new_tag = '';

  for(var i = 0; i < data.tags.length; i++) {
    var tag = data.tags[i];

    if (tag.toLowerCase().indexOf(description_tag) !== -1) {
      new_tag = tag.toLowerCase().replace(description_tag, "").trim();
    }
  }

  return (new_tag !== 'none' && new_tag !== undefined) ? new_tag : '';
}

function buildVariants(data) {
  var html = '';
  for(var i = 0; i < data.options_with_values.length; i++) {
    var option = data.options_with_values[i];

    if (option.name === 'color' || option.name === 'colour') {
      html += '<div class="product-card__swatches product-card-swatches">'+ generateSwatches(option.values) +'</div>';

      if (option.values.length > 1) {
        html += '<span class="product-card-swatches__message caption">' + theme.strings.moreVariantsAvailable + '</span>';
      }
    }
  }

  return html;
}

function generateSwatches(swatchesValues) {
  var htmlSwatches = '';

  for( var j = 0; j < swatchesValues.length; j++) {
    var swatch = swatchesValues[j].title;
    swatchHandle = swatch.toLowerCase();
    swatchHandle = swatchHandle.replace(/\W+/g, "-");
    htmlSwatches +=
      '<a class="product-card-swatches__swatch" href="{{itemUrl}}?variant-color=' + encodeURI(swatch) + '">' +
      '<img alt="' + swatch + '"' +
      'class="product-card-swatches__image"' +
      'src="' + theme.urls.file_url.replace("?", 'swatch-' + swatchHandle + '_20x20.png?') + '"' +
      '/>' +
    '</a>';
  }

  return htmlSwatches;
}

function exists(data){
  data !== null && data !== undefined
}

var countBoxes = 0;
var countExtraBoxes = 0;
var realPage = 0;

function checkPromoBoxesTrue() {
  return (window.theme.promoBoxes && window.theme.promoBoxes.boxes.length > 0);
}

function buildPromoBox(index) {
  var promoBox = window.theme.promoBoxes.boxes[index];
  var promoBoxHtml = '';
  promoBoxHtml += '<a class="promo-box" href="' + promoBox.link + '">' + promoBoxImages(promoBox) + promoBoxGradient(promoBox) + '<div class="promo-box__text">' + promoBoxSubtitle(promoBox) + promoBoxTitle(promoBox) +  promoBoxBtn(promoBox) + '</div>' + '</a>';
  return promoBoxHtml;
}

function promoBoxImages(promoBox) {
  var promoBoxImages = ''
  promoBoxImages += (promoBox.imgSmall) ? '<div class="promo-box__image promo-box__image--mobile lazyload" data-bgset="' + promoBox.imgSmall + '"></div>' : '';
  promoBoxImages += (promoBox.imgLarge) ? '<div class="promo-box__image promo-box__image--desktop lazyload" data-bgset="' + promoBox.imgLarge + '"></div>' : '';
  return promoBoxImages;
}

function promoBoxGradient(promoBox) {
  var promoBoxGradient = ''
  promoBoxGradient += (promoBox.gradient) ? '<div class="boxes-featured-collections__gradient"></div>' : '';
  return promoBoxGradient;
}

function promoBoxSubtitle(promoBox) {
  var promoBoxSubtitle = ''
  if(promoBox.subtitle ){
      promoBoxSubtitle += '<span class="promo-box__subtitle h6">' + promoBox.subtitle + '</span>';
    }
  return promoBoxSubtitle;
}

function promoBoxTitle(promoBox) {
  var promoBoxTitle = ''
  if(promoBox.title || exists ){
  promoBoxTitle += '<span class="promo-box__title d2">' + promoBox.title + '</span>';
    return promoBoxTitle;
  }
}

function promoBoxBtn(promoBox) {
  var promoBoxBtn = ''
  if(promoBox.btn ){
    promoBoxBtn += '<span class="button button--primary button--light button--small">' + promoBox.btn + '</span>';
  }
  return promoBoxBtn;
}


BCSfFilter.prototype.getFilterData = function (a, b) {
  function c(a, b) {
    var c = bcsffilter,
      b = void 0 !== b ? b : 0;
    c.showLoading(), c.buildPlaceholderProductList(a), c.beforeGetFilterData(a), c.prepareRequestParams(a), c.queryParams.callback = "BCSfFilterCallback", c.queryParams.event_type = a;

    countBoxes = c.queryParams.limit * (c.queryParams.page - 1);

    var d = c.isSearchPage() ? c.getApiUrl("search") : c.getApiUrl("filter"),
      e = document.createElement("script");
    e.type = "text/javascript";
    var f = (new Date).getTime();
    e.src = d + "?t=" + f + "&" + jQ.param(c.queryParams), e.id = "bc-sf-filter-script", e.async = !0, e.addEventListener("error", function (d) {
      "function" == typeof document.getElementById(e.id).remove ? document.getElementById(e.id).remove() : document.getElementById(e.id).outerHTML = "", b < 3 ? (b++, c.getFilterData("resend", b)) : c.buildDefaultElements(a)
    }), document.getElementsByTagName("head")[0].appendChild(e), e.onload = function () {
      "function" == typeof document.getElementById(e.id).remove ? document.getElementById(e.id).remove() : document.getElementById(e.id).outerHTML = ""
    }
  }

  this.requestFilter(c, a, b);
}

BCSfFilter.prototype.buildProductListData = function (a, b) {
  (this.isDefaultPaginationType() || !this.isDefaultPaginationType() && "page" != b) && (jQ(this.getSelector("products")).html(""), jQ(window).unbind("scroll"));
  var d = a.length;
  for (var c = "", e = 0; e < d; e++) {
    if(checkPromoBoxesTrue() && window.theme.promoBoxes.positions.indexOf(countBoxes + e + 1) > -1) {
      var promoIndex = window.theme.promoBoxes.positions.indexOf(countBoxes + e + 1);
      c += buildPromoBox(promoIndex);
      countExtraBoxes += 1;
    }

    var f = this.buildProductGridItem(a[e], e + 1, d)
    c += this.buildProductItemAdvanced(a[e], f)
  }

  plpDataLayerImpressions(a);
  this.buildProductListDataHtml(c)
  Frame.EventBus.emit('Datalayer:productListReady');
}

BCSfFilter.prototype.buildProductListDataFromLiquid = function (a, b) {
  //(this.isDefaultPaginationType() || !this.isDefaultPaginationType() && "page" != b) && jQ(window).unbind("scroll"), "sync" == this.getSettingValue("general.loadProductFromLiquidType") ? this.getProductHtmlBySync(a, b) : this.getProductHtmlByAjax(a, b)
}

// Build Sorting
BCSfFilter.prototype.buildFilterSorting = function() {
  if (bcSfFilterConfig.custom.show_sorting && bcSfFilterTemplate.hasOwnProperty('sortingHtml')) {
    jQ(this.selector.topSorting).html('');
    var sortingArr = this.getSortingList();
    if (sortingArr) {
      var paramSort = this.queryParams.sort || '';
      // Build content
      var sortingItemsHtml = '';
      for (var k in sortingArr) {
        activeClass = '';
        if(paramSort == k) {
          activeClass = 'active';
        }
        sortingItemsHtml += '<li><a href="#" data-sort="' + k + '" class="body-2 link--reset ' + activeClass+ '">' + sortingArr[k] + '</a></li>';
      }
      var html = bcSfFilterTemplate.sortingHtml.replace(/{{sortingItems}}/g, sortingItemsHtml);
      jQ('.bc-sf-filter-custom-sorting').html(html);
      if(jQ('.bc-sf-filter-custom-sorting').hasClass("bc-sf-filter-sort-active")) {
        jQ('.bc-sf-filter-custom-sorting').toggleClass('bc-sf-filter-sort-active');
      }

      var labelSort = '';
      if(paramSort.length > 0) {
        var labelHandle = 'sorting_' + paramSort.replace(/\-/g, '_');
        labelSort = bcSfFilterConfig.label[labelHandle];
      } else {
        labelSort = bcSfFilterConfig.label.sorting;
      }

      jQ('.bc-sf-filter-custom-sorting label span span').text(labelSort);
    }
  }
};

BCSfFilter.prototype.buildFilterTreeMobileButton = function (a) {
  var b = !1;
  if (a.hasOwnProperty("filter") && a.filter.hasOwnProperty("options") && a.filter.options.length > 0)
    for (var c = a.filter.options, d = 0; d < c.length; d++)
      if (this.checkShowFilterOption(c[d])) {
        b = !0;
        break
      } if (b) {
    var e = this.getSelector("filterTreeMobile"),
      f = this.getSelector("filterTreeMobileButton"),
      g = !1,
      h = this.class.mobileButtonOpen,
      i = this.getSettingValue("label.refineMobile");
    jQ(f).hasClass(h) && (g = !0, i = this.getSettingValue("label.refineMobileCollapse"));
    var j = bcSfFilterTemplate.filterTreeMobileButton.replace(/{{label}}/g, i);
    jQ(e).html(j), g && jQ(f).addClass(h), this.buildFilterTreeMobileButtonEvent()
  }
}

// Build Sorting event
BCSfFilter.prototype.buildSortingEvent = function() {
  var _this = this;
  jQ('.bc-sf-filter-filter-dropdown a').click(function(e){
    e.preventDefault();
    onInteractWithToolbar(e, 'sort', _this.queryParams.sort, jQ(this).data('sort'));
  });

  jQ(".bc-sf-filter-custom-sorting > label").click(function(){
    if (!jQ('.bc-sf-filter-filter-dropdown').is(':animated')) {
      jQ('.bc-sf-filter-filter-dropdown').toggle().parent().toggleClass('bc-sf-filter-sort-active');
      jQ('#bc-sf-filter-tree').hide();
    }
  });

  jQ(this.getSelector('filterTreeMobileButton')).click(function(){
    jQ('#bc-sf-filter-top-sorting-mobile .bc-sf-filter-filter-dropdown').hide();
  });
};

// Build Breadcrumb
BCSfFilter.prototype.buildBreadcrumb = function(colData, apiData) {
  if (bcSfFilterTemplate.hasOwnProperty('breadcrumbHtml')) {
    var breadcrumbItemsHtml = '';
    if (typeof colData !== 'undefined' && colData.hasOwnProperty('collection')) {
      var colInfo = colData.collection;
      if (typeof this.collectionTags !== 'undefined' && this.collectionTags !== null) {
        breadcrumbItemsHtml += bcSfFilterTemplate.breadcrumbItemLink.replace(/{{itemLink}}/g, '/collections/' + colInfo.handle).replace(/{{itemTitle}}/g, colInfo.title);
        breadcrumbItemsHtml += " {{breadcrumbDivider}} ";
        breadcrumbItemsHtml += bcSfFilterTemplate.breadcrumbItemSelected.replace(/{{itemTitle}}/g, this.collectionTags[0]);
      } else {
        breadcrumbItemsHtml += bcSfFilterTemplate.breadcrumbItemSelected.replace(/{{itemTitle}}/g, colInfo.title);
      }
    } else {
      breadcrumbItemsHtml += bcSfFilterTemplate.breadcrumbItemSelected.replace(/{{itemTitle}}/g, this.getSettingValue('label.defaultCollectionHeader'));
    }
    var html = bcSfFilterTemplate.breadcrumbHtml.replace(/{{breadcrumbItems}}/g, breadcrumbItemsHtml)
    html = html.replace(/{{breadcrumbDivider}}/g, bcSfFilterTemplate.breadcrumbDivider);
    jQ(this.selector.breadcrumb).html(html);
  }
};

// Control the load more button adding the custom theme string
BCSfFilter.prototype.buildLoadMoreEvent = function (a) {
  var b = this;
  if (a.total_product > 0) {
    jQ(b.getSelector("loadMoreButtonContainer") + " .bc-sf-filter-load-more-button").empty().html(theme.strings.loadMore)
  }
  var h, i = (bcsffilter.queryParams, parseInt(this.queryParams.page));
  h = b.isLoadPreviousPagePaginationType() ? parseInt(sessionStorage.getItem(b.getSettingValue("general.sessionStorageCurrentNextPage"))) : i, jQ(this.getSelector("loadMore")).find("a").off("click").on("click", function (a) {
    if (a.preventDefault(), jQ(b.getSelector("loadMoreButtonContainer")).hide(), b.showLoadMoreLoading(), h++, b.internalClick = !0, b.queryParams.limit = b.getSettingValue("general.limit"), b.queryParams.page = h, b.isAdvancedPaginationType()) {
      var c = b.buildToolbarLink("page", i, h);
      b.isLoadPreviousPagePaginationType() && (sessionStorage.setItem(b.getSettingValue("general.sessionStorageCurrentNextPage"), h), sessionStorage.setItem(b.getSettingValue("general.sessionStoragePreviousPageEvent"), 0)), b.onChangeData(c, "page")
    } else b.getFilterData("page")
  })
}

var lastPageShownOnInit = false;
var lastPageShown = false;

// Generate and show the build lore button and container if the last page isn't visible
BCSfFilter.prototype.buildLoadMoreButton = function (a) {
  var b = this.getSelector("loadMore"),
    c = this.getSelector("loadMoreButtonContainer"),
    d = this.queryParams,
    e = Math.ceil(a / d.limit);

    if (0 == jQ(this.getSelector("loadMoreButtonContainer")).length) {
    var f = bcSfFilterTemplate.loadMoreButton.replace(/{{labelLoadMore}}/g, theme.strings.loadMore);
    jQ(b).prepend(f)
  }

  if (d.event_type === "init"){
    lastPageShownOnInit = (parseInt(d.page) === e) ? true : false;
  }

  lastPageShown = (parseInt(d.page) < e) ? false : true;

  if (lastPageShown === true || lastPageShownOnInit === true) {
    jQ(b).hide()
  } else {
    jQ(b).show(), jQ(c).show()
  }
};

BCSfFilter.prototype.buildLoadPreviousButton = function (a, b) {
  var c = this;
  if (c.isLoadPreviousPagePaginationType()) {
    var d = jQ(this.getSelector("btnLoadPreviousPageWrapperSelector"));
    if (0 == jQ(c.getSelector("btnLoadPreviousPageSelector")).length) {
      var e = bcSfFilterTemplate.btnLoadPreviousPageTemplate.replace(/{{loadPreviousPage}}/g, theme.strings.loadPrevious);
      d.html(e)
    }
    var f = c.queryParams,
      g = Math.ceil(a / f.limit),
      h = f.page,
      i = g > 1 && h > 1;
    "init" != b && "page" == b || (sessionStorage.setItem(c.getSettingValue("general.sessionStorageCurrentPreviousPage"), h), sessionStorage.setItem(c.getSettingValue("general.sessionStorageCurrentPage"), h), sessionStorage.setItem(c.getSettingValue("general.sessionStorageCurrentNextPage"), h), sessionStorage.setItem(c.getSettingValue("general.sessionStoragePreviousPageEvent"), 1), i ? d.show() : d.hide())
  }
}

// Build the filter option using custom templates for the button and the filters list
BCSfFilter.prototype.buildFilterOption = function (a, b, c) {
  var d = b.label,
    e = this.class.filterOption + "-" + this.slugify(d),
    f = "vertical" == c ? bcSfFilterTemplate.filterOptionWrapper : bcSfFilterTemplate.filterOptionHorizontalWrapper;
  f = f.replace(/{{blockTitle}}/g, d), f = f.replace(/{{blockTitleId}}/g, this.class.filterBlockTitle + "-" + this.slugify(d)), f = f.replace(/{{blockTypeClass}}/g, this.class.filterOption + "-" + b.displayType), f = f.replace(/{{blockId}}/g, e), f = f.replace(/{{blockContent}}/g, a), f = f.replace(/{{blockContentId}}/g, this.class.filterBlockContent + "-" + this.slugify(d)), f = f.replace(/{{btnApply}}/g, "collection" == b.filterType || "review_ratings" == b.filterType ? "" : '<button class="' + bcSfFilterTemplate.selectFilterOptionButton + '" data-id="' + e + '">' + this.getSettingValue("label.apply") + "</button>"), f = f.replace(/{{tooltip}}/g, this.buildFilterOptionTooltip(b));
  var g = "",
    h = "vertical" == c ? this.getSettingValue("label.clear") : this.getSettingValue("label.clearAll");
  if (this.queryParams.hasOwnProperty(b.filterOptionId) && this.queryParams[b.filterOptionId] && (g = '<a href="javascript:;" aria-label="' + this.getSettingValue("label.clear") + '" class="' + this.class.clearButton + '" onClick="clearFilterOption(event, this, \'' + b.filterOptionId + "')\">" + h + "</a>"), f = f.replace(/{{clearButton}}/g, g), "" !== (f = this.buildFilterTreeClass(f))) {
    var i = jQ(f);
    i.attr({
      "data-id": b.filterOptionId,
      "data-type": b.filterType,
      "data-display-type": b.displayType,
      "data-select-type": b.selectType,
      "data-title": d,
      "data-prefix": b.prefix
    });
    var j = !!b.hasOwnProperty("isCollapseMobile") && b.isCollapseMobile;
    this.getSettingValue("general.collapseOnMobileByDefault") && (j = !0), i.attr("data-collapse-mobile", j);
    var k = null;
    if (["list", "box", "swatch"].indexOf(b.displayType) > -1 && (k = "scrollbar"), b.hasOwnProperty("showMoreType") && b.showMoreType && (k = b.showMoreType), "" != this.getSettingValue("general.showMoreType") && ["list"].indexOf(b.displayType) > -1 && (k = this.getSettingValue("general.showMoreType")), k && i.attr({
        "data-show-more-type": k
      }), this.getSettingValue("general.requestInstantly") && i.find("." + bcSfFilterTemplate.selectFilterOptionButton).hide(), b.hasOwnProperty("useAndCondition") && b.useAndCondition && i.attr("data-and-condition", !0), b.hasOwnProperty("showExactRating") && b.showExactRating && i.attr("data-exact-rating", !0), i.attr("data-filter-option", JSON.stringify(b)), this.queryParams.hasOwnProperty(b.filterOptionId) && this.queryParams[b.filterOptionId] && (!c || "vertical" != c)) {
      var l = this.queryParams[b.filterOptionId].map(function (a) {
        return encodeURIParamValue(a)
      });
      i.attr("data-selected", JSON.stringify(l))
    }
    this.addFilterTreeItem(jQ(i)[0].outerHTML, "after", c), this.checkShowFilterOption(b) || jQ("." + e).addClass(this.class.filterOptionHidden)
  }
}

BCSfFilter.prototype.buildToolbarFilterTreeMobile = function (a) {
  "open" == a ? (jQ(".bc-sf-filter-mobile-toolbar-left").html('<a class="bc-sf-filter-mobile-apply" onclick="applyFilterOption()">' + this.getSettingValue("label.apply") + "</a>"), "collection" != jQ(".bc-sf-filter-option-block-active").data("type") ? jQ(".bc-sf-filter-mobile-toolbar-right").html('<a class="' + this.class.clearButton + '" onClick="clearFilterOptionMobile()">' + this.getSettingValue("label.clear") + "</a>") : jQ(".bc-sf-filter-mobile-toolbar-right").empty()) : (jQ(".bc-sf-filter-mobile-toolbar-left").html('<a href="javascript:;" class="bc-sf-filter-close-btn" onClick="closeFilterMobile()"><span class="visually-hidden">' + this.getSettingValue("label.close") + "</span></a>"), this.checkExistFilterOptionParam() ? jQ(".bc-sf-filter-mobile-toolbar-right").html(this.buildClearAllButton()) : jQ(".bc-sf-filter-mobile-toolbar-right").empty())
}

BCSfFilter.prototype.getFilterTreeMobileTemplate = function (a) {
  switch (a) {
    case "style2":
    case "style3":
      return {
        toolbar: '<div id="bc-sf-filter-mobile-toolbar"><div class="bc-sf-filter-mobile-toolbar-header">' + bcsffilter.getSettingValue("label.refineMobile") + '</div><div class="bc-sf-filter-mobile-toolbar-items"><div class="bc-sf-filter-mobile-toolbar-left"></div><div class="bc-sf-filter-mobile-toolbar-right"></div></div></div>', footer: '<div id="bc-sf-filter-mobile-footer" class="container"><button class="button button--primary button--dark" type="button" onClick="showResultMobile(true)">' + bcsffilter.getSettingValue("label.showResult") + "</button></div>"
      };
    default:
      return ""
  }
}

// Customise the suggestion box moving it in the .search-overlay__results element
BCSfFilter.prototype.customizeSuggestion = function (a, b, c) {
  var fieldId = jQ('.search-bar__input').attr('id');
  jQ('.bc-sf-search-suggestion-wrapper [data-search-box="#' + fieldId + '"]').parent().appendTo('#searchBarOverlay .search-overlay__results');
}

// Build the range filters for the price using either
// bcSfFilterTemplate.filterOptionRange2 or bcSfFilterTemplate.filterOptionRange templates
BCSfFilter.prototype.buildFilterOptionGeneralRange = function (a) {
  if (a && a.hasOwnProperty("values") && 2 == Object.keys(a.values).length) {
    var b = (a.filterType, a.displayType, a.selectType, a.filterOptionId),
      c = a.label,
      d = a.values;
    if (d.hasOwnProperty("min") && d.hasOwnProperty("max") && null !== d.min && null !== d.max) {
      var e = parseFloat(d.min),
        f = parseFloat(d.max),
        g = this.customizeRangeValue(e, f, a.filterType, a),
        e = g[0],
        f = g[1];
      if (this.checkShowFilterOptionRange(e, f, a)) {
        var h = this.class.filterOptionRange,
          i = h + "-slider-" + b + "-v",
          j = h + "-amount-" + b + "-v",
          k = h + "-slider-" + b + "-h",
          l = h + "-amount-" + b + "-h",
          m = e,
          n = f;
        if (this.queryParams.hasOwnProperty(b)) {
          var o = this.queryParams[b][0].split(":");
          o && 2 == o.length && (m = o[0], n = o[1])
        }
        var p = "style2" == this.getSettingValue("general.rangeStyle") ? bcSfFilterTemplate.filterOptionRange2 : bcSfFilterTemplate.filterOptionRange,
          q = this.customizeDisplayRangeValue(m, n, a.filterType, a),
          r = this.getTemplate("filterOptionRangeLabel").replace("{{minValue}}", q[0]).replace("{{maxValue}}", q[1]),
          s = m + ":" + n,
          t = m != e || n != f ? "selected" : "";
        p = p.replace(/{{itemLabel}}/g, r).replace(/{{itemParentId}}/g, b).replace(/{{itemValue}}/g, s).replace(/{{itemParentLabel}}/g, c).replace(/{{itemSelected}}/g, t);
        var u = p.replace(/{{rangeAmountId}}/g, j).replace(/{{rangeSliderId}}/g, i),
          v = p.replace(/{{rangeAmountId}}/g, l).replace(/{{rangeSliderId}}/g, k),
          w = jQ(u),
          x = jQ(v),
          y = '<input type="hidden" class="' + h + "-" + b + '-set" />';
        w.append(y), x.append(y), this.buildFilterOption(jQ(w)[0].outerHTML, a, "vertical"), this.buildFilterOption(jQ(x)[0].outerHTML, a), this.buildFilterOptionGeneralRangeSlider(i, j, m, n, e, f, a), this.buildFilterOptionGeneralRangeSlider(k, l, m, n, e, f, a)
      }
    }
  }
}

// Custom styling of Suggestions Product list to pass a new parameter to the
// header builder to add the total number of products found
BCSfFilter.prototype.buildSuggestionProductList = function (a, b, c, d, e) {
  var f = "";
  var extraInfo = ' (' + e[1].values  + ')';
  f += this.buildSuggestionHeader(d.label, "product", extraInfo);
  var g = this.buildSuggestionDidYouMean(a, e, c);
  if ("" != g && (f += '<li class="' + this.class.searchSuggestionItem + ' bc-sf-search-suggestion-dym" aria-label="Did you mean">' + g + "</li>"), Object.keys(b).length > 0) {
    var h, i = b.length;
    for (h = 0; h < i; h++) {
      var j = b[h],
        k = this.customizeSuggetionProductTitle(j.title, a, b);
      k = this.highlightSuggestionResult(k, a);
      var l = this.buildProductItemUrl(j, !1),
        m = j.images_info.length > 0 ? this.optimizeImage(j.images_info[0].src, "200x") : bcSfFilterConfig.general.no_image_url,
        n = null !== j.skus && j.skus.length > 0 ? j.skus[0] : "",
        o = this.class.searchSuggestion,
        p = this.getSettingValue("search.openProductNewTab") ? 'target="_blank"' : "";
      f += '<li class="' + this.class.searchSuggestionItem + " " + this.class.searchSuggestionItem + '-product" data-label="' + this.escape(j.id) + '" data-value="' + this.escape(j.title) + '" aria-label="' + this.escape(d.label) + ": " + this.escape(j.title) + '">', f += '<a href="' + l + '" ' + p + ">", this.getSettingValue("search.showSuggestionProductImage") && (f += '<div class="' + o + '-left"><img src="' + m + '" /></div>'), f += '<div class="' + o + '-right">', f += '<div class="' + o + '-product-title">' + k + "</div>", this.getSettingValue("search.showSuggestionProductSku") && (f += '<div class="' + o + '-product-sku">SKU: ' + n + "</div>"), this.getSettingValue("search.showSuggestionProductVendor") && (f += '<div class="' + o + '-product-vendor">' + j.vendor + "</div>"), f += this.buildSuggestionProductPrice(j), f += "</div>", f += "</a>", f += "</li>"
    }
  }

  dataLayerListener();

  return f
}

BCSfFilter.prototype.buildSuggestionProductPrice = function (a) {

  var data = prepareShopifyData(a);
  var soldOut = !data.available; // Check a product is out of stock
  var onSale = data.compare_at_price_min > buildMinimumPrice(data); // Check a product is on sale
  var priceVaries = buildMinimumPrice(data) != data.price_max; // Check a product has many prices

  var html = '<div class="' + this.class.searchSuggestion + '-product-price">';
  if (onSale) {
    html += '<span class="visually-hidden">' + (data.compare_at_price * 100) + '</span>'

    html += '<s data-price="' + (data.compare_at_price_min * 100) + '" js-currency="price">' + bcsffilter.formatMoney((data.compare_at_price_min * 100)) + '</s> ';

    html += '<span class="color--brand bc-sf-product-sale-price" data-price="' + (buildMinimumPrice(data) * 100) +'" js-currency="price">' + bcsffilter.formatMoney((buildMinimumPrice(data) * 100)) + '</span>';

  } else {
    if (priceVaries) {
      html += (bcSfFilterConfig.label_basic.from) + ' ';
    }
    html += '<span class="bc-sf-product-regular-price" data-price="' + (buildMinimumPrice(data) * 100) +'" js-currency="price">' + bcsffilter.formatMoney((buildMinimumPrice(data) * 100)) + '</span>';

  }
  html += '</div>';
  return html;
}

// Builds the Suggestion Headers (all, not only the products one)
BCSfFilter.prototype.buildSuggestionHeader = function (a, b, extra) {
  var c = this.class.searchSuggestionHeader;
  var extraInfo = (extra) ? extra : '';

  return '<li class="' + c + "-" + b + " " + c + '" aria-label="' + this.escape(a) + '">' + a + extraInfo + "</li>"
}

// Write the total number of products
BCSfFilter.prototype.buildAdditionalElements = function (a, b) {
  var totalString = window.theme.strings.totalResults.replace('{{total}}', a.total_product);
  jQ('.bc-sf-filter-total-product').html(totalString);

  document.querySelector('.products-list__grid').classList.remove('hidden');
}

function dataLayerListener() {
  $('.main-content')
    .on('click', '.product-card a', function() {
      localStorage.setItem('datalayerList', 'homepage');
    })
}

function dataLayerStringFormat(string) {
  return string.replace(/[^a-zA-Z0-9&]/g, "_");
}

function tagByName(tagname, tags) {
  for(var i = 0; i < tags.length; i++) {
    var tag = tags[i];

    if (tag.indexOf(tagname+": ") !== -1) {
      return tag.replace(tagname+": ", "");
    }
  }
}

function listType() {
  let urlParams = (new URL(document.location)).searchParams;

  const sortParams = urlParams.get('sort');

  if (sortParams) {
    switch(sortParams) {
      case 'best-selling':
        return 'sorting_best_selling';
      case 'manual':
        return 'sorting_featured';
      case 'price-ascending':
        return 'sorting_increase_price';
      case 'price-descending':
        return 'sorting_decrease_price';
      case 'title-ascending':
        return 'sorting_a_z';
      case 'title-descending':
        return 'sorting_z_a';
      case 'created-descending':
        return 'sorting_newest_to_oldest';
      case 'created-ascending':
        return 'sorting_oldest_to_newest';
    }
  }

  return (theme.pageType === 'search')
      ? 'search_result'
      : 'product_navigation'
}

var product_position = 0;

function plpDataLayerImpressions(productsList) {
  var productsNumber = productsList.length;
  var productsCount = 1;
  var impressionsArray = [];

  for (var i = 0; i < productsNumber; i++) {
    product_position++;
    var product = productsList[i];
    var product_price = +(product.price / 100).toFixed(2);
    var productList = listType();

    var productImpression = {
      name: dataLayerStringFormat(product.title),
      id: product.id.toString(),
      price: product_price,
      brand: 'alessi',
      category: tagByName("category", product.tags),
      list: productList,
      position: product_position,
      dimension15: tagByName("macro_category", product.tags)
    }

    impressionsArray.push(productImpression);

    if (productsCount === productsList.length) {
      window.dataLayer.push({
        event: 'productImpression',
        ecommerce: {
          currencyCode: window.theme.currency,
          impressions: impressionsArray
        }
      });

      localStorage.setItem('datalayerList', productList);
    }

    productsCount++;
  }
}

// Build Default layout
function buildDefaultLink(a,b){var c=window.location.href.split("?")[0];return c+="?"+a+"="+b}BCSfFilter.prototype.buildDefaultElements=function(a){if(bcSfFilterConfig.general.hasOwnProperty("collection_count")&&jQ("#bc-sf-filter-bottom-pagination").length>0){var b=bcSfFilterConfig.general.collection_count,c=parseInt(this.queryParams.page),d=Math.ceil(b/this.queryParams.limit);if(1==d)return jQ(this.selector.pagination).html(""),!1;if("default"==this.getSettingValue("general.paginationType")){var e=bcSfFilterTemplate.paginateHtml,f="";f=c>1?bcSfFilterTemplate.hasOwnProperty("previousActiveHtml")?bcSfFilterTemplate.previousActiveHtml:bcSfFilterTemplate.previousHtml:bcSfFilterTemplate.hasOwnProperty("previousDisabledHtml")?bcSfFilterTemplate.previousDisabledHtml:"",f=f.replace(/{{itemUrl}}/g,buildDefaultLink("page",c-1)),e=e.replace(/{{previous}}/g,f);var g="";g=c<d?bcSfFilterTemplate.hasOwnProperty("nextActiveHtml")?bcSfFilterTemplate.nextActiveHtml:bcSfFilterTemplate.nextHtml:bcSfFilterTemplate.hasOwnProperty("nextDisabledHtml")?bcSfFilterTemplate.nextDisabledHtml:"",g=g.replace(/{{itemUrl}}/g,buildDefaultLink("page",c+1)),e=e.replace(/{{next}}/g,g);for(var h=[],i=c-1;i>c-3&&i>0;i--)h.unshift(i);c-4>0&&h.unshift("..."),c-4>=0&&h.unshift(1),h.push(c);for(var j=[],k=c+1;k<c+3&&k<=d;k++)j.push(k);c+3<d&&j.push("..."),c+3<=d&&j.push(d);for(var l="",m=h.concat(j),n=0;n<m.length;n++)"..."==m[n]?l+=bcSfFilterTemplate.pageItemRemainHtml:l+=m[n]==c?bcSfFilterTemplate.pageItemSelectedHtml:bcSfFilterTemplate.pageItemHtml,l=l.replace(/{{itemTitle}}/g,m[n]),l=l.replace(/{{itemUrl}}/g,buildDefaultLink("page",m[n]));e=e.replace(/{{pageItems}}/g,l),jQ(this.selector.pagination).html(e)}}if(bcSfFilterTemplate.hasOwnProperty("sortingHtml")&&jQ(this.selector.topSorting).length>0){jQ(this.selector.topSorting).html("");var o=this.getSortingList();if(o){var p="";for(var q in o)p+='<option value="'+q+'">'+o[q]+"</option>";var r=bcSfFilterTemplate.sortingHtml.replace(/{{sortingItems}}/g,p);jQ(this.selector.topSorting).html(r);var s=void 0!==this.queryParams.sort_by?this.queryParams.sort_by:this.defaultSorting;jQ(this.selector.topSorting+" select").val(s),jQ(this.selector.topSorting+" select").change(function(a){window.location.href=buildDefaultLink("sort_by",jQ(this).val())})}}};

BCSfFilter.prototype.prepareProductData = function(data) { var countData = data.length; for (var k = 0; k < countData; k++) { data[k]['images'] = data[k]['images_info']; if (data[k]['images'].length > 0) { data[k]['featured_image'] = data[k]['images'][0] } else { data[k]['featured_image'] = { src: bcSfFilterConfig.general.no_image_url, width: '', height: '', aspect_ratio: 0 } } data[k]['url'] = '/products/' + data[k].handle; var optionsArr = []; var countOptionsWithValues = data[k]['options_with_values'].length; for (var i = 0; i < countOptionsWithValues; i++) { optionsArr.push(data[k]['options_with_values'][i]['name']) } data[k]['options'] = optionsArr; if (typeof bcSfFilterConfig.general.currencies != 'undefined' && bcSfFilterConfig.general.currencies.length > 1) { var currentCurrency = bcSfFilterConfig.general.current_currency.toLowerCase().trim(); function updateMultiCurrencyPrice(oldPrice, newPrice) { if (typeof newPrice != 'undefined') { return newPrice; } return oldPrice; } data[k].price_min = updateMultiCurrencyPrice(data[k].price_min, data[k]['price_min_' + currentCurrency]); data[k].price_max = updateMultiCurrencyPrice(data[k].price_max, data[k]['price_max_' + currentCurrency]); data[k].compare_at_price_min = updateMultiCurrencyPrice(data[k].compare_at_price_min, data[k]['compare_at_price_min_' + currentCurrency]); data[k].compare_at_price_max = updateMultiCurrencyPrice(data[k].compare_at_price_max, data[k]['compare_at_price_max_' + currentCurrency]); } data[k]['price_min'] *= 100, data[k]['price_max'] *= 100, data[k]['compare_at_price_min'] *= 100, data[k]['compare_at_price_max'] *= 100; data[k]['price'] = data[k]['price_min']; data[k]['compare_at_price'] = data[k]['compare_at_price_min']; data[k]['price_varies'] = data[k]['price_min'] != data[k]['price_max']; var firstVariant = data[k]['variants'][0]; if (getParam('variant') !== null && getParam('variant') != '') { var paramVariant = data.variants.filter(function(e) { return e.id == getParam('variant') }); if (typeof paramVariant[0] !== 'undefined') firstVariant = paramVariant[0] } else { var countVariants = data[k]['variants'].length; for (var i = 0; i < countVariants; i++) { if (data[k]['variants'][i].available) { firstVariant = data[k]['variants'][i]; break } } } data[k]['selected_or_first_available_variant'] = firstVariant; var countVariants = data[k]['variants'].length; for (var i = 0; i < countVariants; i++) { var variantOptionArr = []; var count = 1; var variant = data[k]['variants'][i]; var variantOptions = variant['merged_options']; if (Array.isArray(variantOptions)) { var countVariantOptions = variantOptions.length; for (var j = 0; j < countVariantOptions; j++) { var temp = variantOptions[j].split(':'); data[k]['variants'][i]['option' + (parseInt(j) + 1)] = temp[1]; data[k]['variants'][i]['option_' + temp[0]] = temp[1]; variantOptionArr.push(temp[1]) } data[k]['variants'][i]['options'] = variantOptionArr } data[k]['variants'][i]['compare_at_price'] = parseFloat(data[k]['variants'][i]['compare_at_price']) * 100; data[k]['variants'][i]['price'] = parseFloat(data[k]['variants'][i]['price']) * 100 } data[k]['description'] = data[k]['content'] = data[k]['body_html']; if(data[k].hasOwnProperty('original_tags') && data[k]['original_tags'].length > 0){ data[k].tags = data[k]['original_tags'].slice(0); }} return data };

/* Begin patch boost-010 run 2 */
BCSfFilter.prototype.initFilter=function(){return this.isBadUrl()?void(window.location.href=window.location.pathname):(this.updateApiParams(!1),void this.getFilterData("init"))},BCSfFilter.prototype.isBadUrl=function(){try{var t=decodeURIComponent(window.location.search).split("&"),e=!1;if(t.length>0)for(var i=0;i<t.length;i++){var n=t[i],a=(n.match(/</g)||[]).length,r=(n.match(/>/g)||[]).length,o=(n.match(/alert\(/g)||[]).length,h=(n.match(/execCommand/g)||[]).length;if(a>0&&r>0||a>1||r>1||o||h){e=!0;break}}return e}catch(l){return!0}};
/* End patch boost-010 run 2 */
