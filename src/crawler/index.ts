import request from "request";
import cheerio from "cheerio";

let userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.100 Safari/537.36";

export type requestOptions = (request.UriOptions & request.CoreOptions) | (request.UrlOptions & request.CoreOptions)

function parseOptions(options: string | requestOptions): requestOptions {
  let newOptions: requestOptions
  if (typeof options === 'string') {
    newOptions = {
      url: options,
      headers: {
        'User-Agent': userAgent
      }
    }
  } else {
    newOptions = options
    if (!newOptions.headers) {
      newOptions.headers = {
        'User-Agent': userAgent
      }
    } else if (!newOptions.headers['User-Agent']) {
      newOptions.headers['User-Agent'] = userAgent
    }
  }
  return newOptions;
}

type RuleFunction = // 获取元素数据的方法，需要配合一个元素使用；方法操作元素，方法不同，返回值不同
  "text" | "value" | "html"               // 直接获取元素的文本，值，或网页内容，返回值也是一段string
  | ["text" | "value" | "html"]           // 前三者的另一种写法，多加一个[]
  | ["data" | "attr" | "prop" | "css", string]  // 获取元素的指定数据，特性，状态，需要一个string参数,返回值一般情况下都是string，但在查询状态时还有可能为数值或bool类型
  | ["findOne" | "find", string, Rule]          // 访问元素的单个或一批子元素，然后按规则操作子元素，第一个string参数为css提取器，第2个为操作每个子元素的规则对象；单个元素时返回值为规则对象操作元素的翻柜子，多个子元素时返回值为规则对象操作每个子元素的返回值组成的数组
  | Rule;   // 直接使用一个规则对象作为获取元素数据的方法，返回值不确定类型

export interface Rule { //操作元素的规则，需配合一个元素使用；规则操作元素的返回值默认是一个对象，对象的每个键x的值，是使用键x对应的获取元素数据的方法获取到的元素数据；当拥有键“_”时，规则的返回值替换为键“_”对饮的获取元素数据的方法获取到的元素数据
  _?: RuleFunction;
  [x: string]: RuleFunction;
}

// 访问指定网页，将其转化为一个根元素，然后逐步提取内容
export function crawlerParsedWebPage(options: string | requestOptions, rule: Rule): Promise<any> {
  let newOptions = parseOptions(options)
  return new Promise((resolve, reject) => {
    request(newOptions, (error, response, body) => {
      if (error) {
        reject(error)
        return
      }
      if (response.statusCode !== 200) {
        reject(`${response.statusCode} ${response.statusMessage}`)
        return
      }
      let rootElement = cheerio.load(body).root()
      resolve(parseElementByRule(rootElement, rule))
    })
  })
}

function parseElementByFn(element: Cheerio, fn: RuleFunction): any {
  if (typeof fn === "string") {
    fn = [fn];
  }
  if (fn instanceof Array) {
    switch (fn[0]) {
      case "text":
        return element.text();

      case "value":
        return element.val();

      case "html":
        return element.html();

      case "css":
        let css_propName = fn[1];
        if (typeof css_propName !== "string") {
          return null;
        }
        return element.css(css_propName);

      case "data":
        let data_name = fn[1];
        if (typeof data_name !== "string") {
          return null;
        }
        return element.data(data_name);

      case "attr":
        let attr_name = fn[1];
        if (typeof attr_name !== "string") {
          return null;
        }
        return element.attr(attr_name);

      case "prop":
        let prop_name = fn[1];
        if (typeof prop_name !== "string") {
          return null;
        }
        return element.prop(prop_name);

      case "findOne":
        let findOne_selector = fn[1];
        if (typeof findOne_selector !== "string") {
          return null;
        }
        let findOne_cbRule = fn[2];
        let findOne_descendantElements = element.find(findOne_selector);
        if (findOne_descendantElements.length === 0) {
          return null;
        } else {
          let findOne_firstDescendantElement = findOne_descendantElements.first();
          return parseElementByRule(
            findOne_firstDescendantElement,
            findOne_cbRule
          );
        }

      case "find":
        let find_selector = fn[1];
        if (typeof find_selector !== "string") {
          return null;
        }
        let find_cbRule = fn[2];
        let find_descendantElements = element.find(find_selector);
        let find_result = new Array(find_descendantElements.length);
        find_descendantElements.each(function (i, elem) {
          let find_descendantElement = cheerio(elem);
          find_result[i] = parseElementByRule(
            find_descendantElement,
            find_cbRule
          );
        });
        return find_result;

      default:
        return null;
    }
  } else if (fn instanceof Object) {
    return parseElementByRule(element, fn);
  }
  return null;
}

function parseElementByRule(element: Cheerio, rule: Rule): any {
  let result = {} as { [x: string]: any };
  if (typeof rule === "object") {
    if (rule["_"]) {
      let fn = rule["_"];
      return parseElementByFn(element, fn);
    } else {
      for (let key of Object.keys(rule)) {
        let fn = rule[key];
        result[key] = parseElementByFn(element, fn);
      }
    }
  }
  return result;
}
