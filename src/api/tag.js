import {api} from 'boot/axios';

// /api/tag/create-new-tags
// 新增标签
const createNewTagsReq = {
  "tagPathList": [ // 标签路径列表, 必填, List<String>, 不能为null, 不能重名, 不能为空字符串
    "大学/课程/智能移动平台开发",
    "大学/课程/操作系统（H)"
  ]
};
export function createNewTags(createNewTagsReq){
    return api.post('/tag/create-new-tags', createNewTagsReq);
}

// /api/tag/details/get-all-first-level-tags
// 详细-获取所有第一层次的tag
export function getAllFirstLevelTags(){
    return api.get('/tag/details/get-all-first-level-tags');
}

// /api/tag/details/get-all-tags
// 详细-获取所有tag信息
export function getAllTags(){
    return api.get('/tag/details/get-all-tags');
}

// /api/tag/details/get-tag-by-name/{tag-name}
// 详细-获取指定name的tag
export function getTagByName(tagName){
    return api.get(`/tag/details/get-tag-by-name/${tagName}`);
}

// /api/tag/simple/get-all-first-level-tags
// 简洁-获取所有第一层次的tag
export function getAllFirstLevelTagsWithSimpleInfo(){
    return api.get('/tag/simple/get-all-first-level-tags');
}

// /api/tag/simple/get-all-tags
// 简洁-获取所有tag信息
export function getAllTagsWithSimpleInfo(){
    return api.get('/tag/simple/get-all-tags');
}

// /api/tag/simple/get-tag-by-name/{tag-name}
// 简洁-获取指定name的tag
export function getTagByNameWithSimpleInfo(tagName){
    return api.get(`/tag/simple/get-tag-by-name/${tagName}`);
}
