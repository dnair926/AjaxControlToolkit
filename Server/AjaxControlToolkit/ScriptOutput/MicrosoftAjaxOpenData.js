// (c) 2010 CodePlex Foundation
(function(){var a=null;function b(){var p="\r\n--",j="\r\n",i="--",v="DataServiceVersion",m="GET",h="application/json",f="Content-Type",o="DELETE",n="MERGE",l="POST",c="/",k="undefined",e=false,g=true,u="$inlinecount",t="$filter",s="$orderby",r="$top",q="$skip",d="";Type._registerScript("MicrosoftAjaxOpenData.js",["MicrosoftAjaxDataContext.js"]);var b,y,x=Sys._merge,w=Sys._forIn;Type.registerNamespace("Sys.Data");if(!Sys.Data.IDataProvider){b=Sys.Data.IDataProvider=function(){};b.registerInterface("Sys.Data.IDataProvider")}if(!Sys.Data.MergeOption){b=Sys.Data.MergeOption=function(){};b.prototype={appendOnly:0,overwriteChanges:1};b.registerEnum("Sys.Data.MergeOption")}b=Sys.Data.OpenDataQueryBuilder=function(c){var a=this;a._queryParameters={};a._uri=c;var e=c.indexOf("?");if(e>=0){a._uri=c.substr(0,e);var g=c.substr(e+1).split("&");for(var h in g){var b=g[h],f=b.indexOf("=");if(f>=0)a._queryParameters[decodeURIComponent(b.substr(0,f))]=decodeURIComponent(b.substr(f+1));else a._queryParameters[decodeURIComponent(b)]=d}}};b.prototype={_queryParameters:a,_uri:a,get_skip:function(){return this._getIntParam(q)},set_skip:function(a){this._setParam(q,a)},get_top:function(){return this._getIntParam(r)},set_top:function(a){this._setParam(r,a)},get_orderby:function(){return this._getStringParam(s)},set_orderby:function(a){this._setParam(s,a)},get_filter:function(){return this._getStringParam(t)},set_filter:function(a){this._setParam(t,a)},get_select:function(){return this._getStringParam("$select")},set_select:function(a){this._setParam("$select",a)},get_expand:function(){return this._getStringParam("$expand")},set_expand:function(a){this._setParam("$expand",a)},get_inlineCount:function(){return this._getStringParam(u)},set_inlineCount:function(a){this._setParam(u,a)},get_resourcePath:function(){return this._uri},get_queryParameters:function(){return this._queryParameters},set_queryParameters:function(a){this._queryParameters=a},toString:function(){var b,f,d,c=[],i=this._queryParameters,j=Sys.Data.OpenDataQueryBuilder._queryOptions;for(b in i)if(i.hasOwnProperty(b)&&!Array.contains(j,b)){d=i[b];d!=a&&c.push({key:b,value:d})}for(f in j){b=j[f];d=i[b];d!=a&&c.push({key:b,value:d})}var h=new Sys.StringBuilder(this._uri),k=g;for(f in c)if(c.hasOwnProperty(f)){h.append(k?"?":"&");h.append(encodeURIComponent(c[f].key));h.append("=");h.append(encodeURIComponent(c[f].value));k=e}return h.toString()},_getIntParam:function(c){var b=parseInt(this._queryParameters[c]);return isNaN(b)?a:b},_getStringParam:function(c){var b=this._queryParameters[c];return b||a},_setParam:function(c,b){if(typeof b===k||b===a)delete this._queryParameters[c];else this._queryParameters[c]=b}};b._queryOptions=[t,s,q,r];b.registerClass("Sys.Data.OpenDataQueryBuilder");b=Sys.Data._OpenDataUtil=function(){};b.concatUris=function(b,a){if(a.indexOf("//")>=0)return a;if(b.endsWith(c))b=b.substr(0,b.length-1);if(a.startsWith(c))a=a.substr(1);return b+c+a};b.extractETag=function(b){return b.__metadata?b.__metadata.etag||a:a};b.extractUri=function(b){return b.__metadata?b.__metadata.uri||a:a};b.registerClass("Sys.Data._OpenDataUtil");b=Sys.Data.OpenDataActionResult=function(e,c,b,d){var a=this;a._result=e;a._headers=c||{};a._actionContext=b;a._operation=d};b.prototype={_actionContext:a,_operation:a,_result:a,_headers:a,get_httpHeaders:function(){return this._headers},get_actionContext:function(){return this._actionContext},get_operation:function(){return this._operation},get_result:function(){return this._result}};b.registerClass("Sys.Data.OpenDataActionResult");b=Sys.Data.OpenDataActionSequence=function(a){this._actionQueue=[];this._dataService=a};b.prototype={get_serviceProxy:function(){return this._dataService},addInsertAction:function(c,a,b){this._actionQueue.push([0,a,c,b])},addUpdateAction:function(d,c,b){var e=this._actionQueue;this._actionQueue.push([1,c||a,d,b])},addRemoveAction:function(c,b){this._actionQueue.push([2,a,c,b])},clearActions:function(){this._actionQueue=[]},execute:function(p,q,r){var g=this,j=g._actionQueue,c=new Sys.Data._OpenDataBatchWriter(window.location.host),m=g._dataService;g._actionQueue=[];c.startChangeSet();for(var i=0,s=j.length;i<s;i++){var d=j[i],e=d[1],h=d[2],k=Sys.Data._OpenDataUtil.extractETag(h);switch(d[0]){case 0:d[0]="insert";c.addChange(e,k,l,Sys.Serialization.JavaScriptSerializer.serialize(h),i);break;case 1:d[0]="edit";if(!e)e=Sys.Data._OpenDataUtil.extractUri(h);c.addChange(e,k,m.get_replaceOnUpdate()?"PUT":n,Sys.Serialization.JavaScriptSerializer.serialize(h));break;case 2:d[0]="remove";e=Sys.Data._OpenDataUtil.extractUri(h);c.addChange(e,k,o,a)}}c.endChangeSet();var b=new Sys.Net.WebRequest;b.set_url(Sys.Data._OpenDataUtil.concatUris(m.get_serviceUri(),"$batch"));b.get_headers()[f]="multipart/mixed; boundary="+c.get_topBoundary();b.set_httpVerb(l);b.set_timeout(m.get_timeout());b.set_body(c.get_requestBody());b.set_userContext({q:j,bw:c,c:r,s:p,f:q});b.add_completed(Function.createDelegate(g,g._batchCompleted));b.invoke();return b},_batchCompleted:function(j){var b="actionSequence",i,c,d,l=j.get_webRequest().get_userContext(),v=l.q,t=l.f,s=l.s,q=l.c,z=l.bw,g=this._dataService._checkForError(j,b,e);function x(){var c=d.status?parseFloat(d.status.code):-1;if(c<200||c>300){var j;if(d.headers[f]===h){var i=Sys.Serialization.JavaScriptSerializer.deserialize(d.body);g=Sys.Data.OpenDataActionSequence._getError(e,c,a,i,b)}else g=Sys.Data.OpenDataActionSequence._getError(e,c,String.format(Sys.Data.OpenDataRes.operationFailed,b))}}function n(){t&&t(g,q,b)}if(g){n();return}c=Sys.Data._OpenDataBatchReader._parseResponse(j);if(c.length!==1){g=Sys.Data.OpenDataActionSequence._getError(e,-1,String.format(Sys.Data.OpenDataRes.invalidBatchResponse,j.get_webRequest().get_url()));n();return}c=c[0];if(c.length===1){d=c[0];x();if(g){n();return}}if(c.length!==v.length){g=Sys.Data.OpenDataActionSequence._getError(e,-1,String.format(Sys.Data.OpenDataRes.invalidBatchResponse,j.get_webRequest().get_url()));n();return}if(s){for(var w=c.length,u=new Array(w),p,m=0;m<w;m++){d=c[m];p=d.body;i=a;if(p){i=Sys.Serialization.JavaScriptSerializer.deserialize(p);if(i&&i.d)i=i.d}var r=v[m],o=r[3],y=r[0];if(typeof o===k)o=a;u[m]=new Sys.Data.OpenDataActionResult(i,d.headers,o,y)}s(u,q,b)}}};b.registerClass("Sys.Data.OpenDataActionSequence");b._getError=function(h,l,i,d,g){var c,f=d?d.error:a;if(!f)c=new Sys.Net.WebServiceError(h,String.format(i||Sys.Data.OpenDataRes.operationFailed,g));else{var b=f.message,e=f.innererror,j,k;b=b&&b.value?b.value:a;if(e){k=e.type;j=e.stacktrace}c=new Sys.Net.WebServiceError(h,String.format(i||b||Sys.Data.OpenDataRes.operationFailed,g),j||a,k||a,d)}c._statusCode=l;return c};b=Sys.Data.OpenDataInvokeParametersBuilder=function(){this._queryBuilder=new Sys.Data.OpenDataQueryBuilder(d);this._parameters=this._queryBuilder.get_queryParameters()};b.prototype={_parameters:a,_queryBuilder:a,get_parameters:function(){return this._parameters},addBoolean:function(b,a){this._parameters[b]=a.toString()},addDate:function(d,a,b){var c=b?a.format("yyyy-MM-ddTHH:mm:ss.fffffffzzz"):a.format("yyyy-MM-ddTHH:mm:ss.fffffff");this._parameters[d]="datetime'"+c+"'"},addDecimal:function(b,a){this._parameters[b]=a.toString()+"M"},addDouble:function(b,a){this._parameters[b]=a.toString()},addGuid:function(b,a){this._parameters[b]="guid'"+a+"'"},addInteger:function(b,a){this._parameters[b]=a.toString()},addString:function(b,a){this._parameters[b]="'"+a.replace(new RegExp("'","g"),"''")+"'"},toString:function(){return this._queryBuilder.toString()}};b.registerClass("Sys.Data.OpenDataInvokeParametersBuilder");b=Sys.Data.OpenDataServiceProxy=function(a){Sys.Data.OpenDataServiceProxy.initializeBase(this);a&&this.set_path(a)};b.prototype={_replaceOnUpdate:e,_usePostTunneling:g,get_replaceOnUpdate:function(){return this._replaceOnUpdate},set_replaceOnUpdate:function(a){this._replaceOnUpdate=a},get_serviceUri:function(){return this.get_path()||d},set_serviceUri:function(a){this.set_path(a||d)},createActionSequence:function(){return new Sys.Data.OpenDataActionSequence(this)},insert:function(g,d,b,c,e,f){var a=this._prepareWebRequest(g,d,l,b,c,e,"insert",f);a.invoke();return a},invoke:function(d,b,i,f,g,h,j){var c=new Sys.Data.OpenDataQueryBuilder(d);c._queryParameters=x(a,c._queryParameters,i);b=b||m;var e=this._prepareWebRequest(a,c.toString(),b,f,g,h,d,j);e.invoke();return e},fetchData:function(e,b,m,n,i,j,h,l){var c=this,g,d=a;if(typeof h!==k){d=c.get_timeout();c.set_timeout(h)}if(b)for(var f in b)if(b.hasOwnProperty(f))e+=(e.indexOf("?")<0?"?":"&")+encodeURIComponent(f)+"="+encodeURIComponent(b[f]);g=c.query(e,i,j,l);d!==a&&c.set_timeout(d);return g},fetchDeferredProperty:function(b,d,g,i,j,k){var h=Function.createDelegate(this,function(f,e,c){b[d]=f;var a=g||this.get_defaultSucceededCallback();a&&a(b,e,c)}),e;if(b[d]&&b[d].__deferred&&b[d].__deferred.uri)e=b[d].__deferred.uri;else if(b.__metadata&&b.__metadata.uri)e=b.__metadata.uri+c+d;var f=this._prepareWebRequest(a,e,m,h,i,j,d,k);f.invoke();return f},query:function(c,d,e,f,g){var b=this._prepareWebRequest(a,c,m,d,e,f,c,g);b.invoke();return b},update:function(g,c,d,e,f){var h=this._replaceOnUpdate?"PUT":n,b=this._prepareWebRequest(g,a,h,c,d,e,"update",f);b.invoke();return b},remove:function(h,c,d,e,g){var b=this._prepareWebRequest(h,a,o,c,d,e,"remove",g);b.set_body(a);delete b.get_headers()[f];b.invoke();return b},_checkForError:function(d,n,p){var g=this,b,k=a,l=e,c=0;if(!d.get_responseAvailable()){l=d.get_timedOut();b=l?Sys.Data.OpenDataRes.operationTimedOut:String.format(Sys.Data.OpenDataRes.operationFailed,n)}else{c=d.get_statusCode();if(c===1223||c===0)c=204;if(p){var m=parseFloat(d.getResponseHeader(v));if((isNaN(m)||m>2)&&c!==204)b=isNaN(m)?String.format(Sys.Data.OpenDataRes.uriNotOpenDataService,g.get_serviceUri()):String.format(Sys.Data.OpenDataRes.serviceVersionTooHigh,g.get_serviceUri())}if(!b&&(c<200||c>=300)){var i=d.getResponseHeader(f);if(i.startsWith(h))k=d.get_object();else if(i.startsWith("application/xml")||i.startsWith("text/xml")){var q=d.get_xml(),j=q.documentElement.getElementsByTagName("message");if(j&&j.length){var o=j[0];if(o.childNodes.length)b=o.childNodes[0].nodeValue}if(!b)b=String.format(Sys.Data.OpenDataRes.uriNotOpenDataService,g.get_serviceUri())}else b=String.format(Sys.Data.OpenDataRes.uriNotOpenDataService,g.get_serviceUri())}}return b||k?Sys.Data.OpenDataActionSequence._getError(l,c,b,k,n):a},_onResponseComplete:function(c,l,k,j,e){var m=this._checkForError(c,e,g);if(m)k&&k(m,j,e);else if(l){var p=parseFloat(c.getResponseHeader(v))||1,o=c.getResponseHeader(f),b=a;if(o.startsWith(h)){b=c.get_object();b=b.d||b}var n=b,i=a;if(p>=2){n=b.results;delete b.results;i={};w(b,function(b,a){i[a.replace(/^\_+/,d)]=b})}l(n,j,e,i)}},_prepareWebRequest:function(j,t,r,p,m,i,u,b){var c=this;b=b||new Sys.Net.WebRequest;b.set_url(Sys.Data._OpenDataUtil.concatUris(c.get_serviceUri(),t||d));b.set_timeout(c.get_timeout());var e=b.get_headers();e.Accept=h;e.MaxDataServiceVersion="2.0;OpenDataAjax";b.set_httpVerb(r);if(c._usePostTunneling){var g=r.toUpperCase();if(g==="PUT"||g===o||g===n){b.set_httpVerb(l);e["X-HTTP-Method"]=g}}if(j){b.set_body(Sys.Serialization.JavaScriptSerializer.serialize(j));e[f]=h;var q=Sys.Data._OpenDataUtil.extractETag(j);if(q)e["If-Match"]=q;var s=Sys.Data._OpenDataUtil.extractUri(j);s&&b.set_url(s)}p=p||c.get_defaultSucceededCallback();m=m||c.get_defaultFailedCallback();if(typeof i===k||i===a)i=c.get_defaultUserContext();b.add_completed(Function.createDelegate(c,function(a){this._onResponseComplete(a,p,m,i,u)}));return b}};b.registerClass("Sys.Data.OpenDataServiceProxy",Sys.Net.WebServiceProxy,Sys.Data.IDataProvider);Sys.registerComponent(b,{parameters:["serviceUri"]});b=Sys.Data._OpenDataBatchReader=function(b,c){var a=this;a._responseBody=b;a._boundary=[c];a._position=0;a._responses=[];a._parseParts(a._responses)};b.prototype={get_responses:function(){return this._responses},_parseParts:function(e){var b=this;if(b._readToMark(i+b._currentBoundary(),g)===a)return;b._readLine();var h=a;while(h!==i&&!b._eof()){var d=[];b._parseHeaders(d);var c=d[f];if(c.indexOf("multipart/mixed")===0){var j=[];b._boundary.push(Sys.Data._OpenDataBatchReader._boundaryFromTypeHeader(c));b._parseParts(j);b._boundary.pop();e.push(j);var k=b._readToMark(i+b._currentBoundary(),g)}else c.indexOf("application/http")===0&&e.push(b._parseHttpResponse());h=b._peek(2);b._readLine()}},_parseHttpResponse:function(){var a=this,f=a._readLine(),e=a._parseStatus(f),c=[];a._parseHeaders(c);var b=a._readToMark(i+a._currentBoundary(),g);if(b===j)b=d;return{status:e,headers:c,body:b}},_parseHeaders:function(c){for(var a=this._readLine();a;a=this._readLine()){var b=this._parseHeader(a);c[b.name]=b.value}},_parseHeader:function(b){if(b===a)return a;var c=b.indexOf(":");return c===-1?a:{name:b.substring(0,c).trim(),value:b.substring(c+1).trim()}},_parseStatus:function(c){var b=Sys.Data._OpenDataBatchReader._statusRegExp.exec(c);return b?{code:b[1],text:b[2]}:a},_currentBoundary:function(){return this._boundary[this._boundary.length-1]},_eof:function(){return this._position===-1},_readLine:function(){return this._readToMark(j,e)},_readToMark:function(e,f){var b=this;if(b._eof())return a;var c,d=b._responseBody.indexOf(e,b._position);if(d<0)if(f)c=a;else{c=b._responseBody.substring(b._position);b._position=-1}else{c=b._responseBody.substring(b._position,d);b._position=d+e.length}return c},_peek:function(b){var a=this;return a._eof()?d:a._responseBody.substring(a._position,a._position+b)}};b._boundaryFromTypeHeader=function(c){var d=/;\s*boundary=(.*)$/i,b=d.exec(c);return b?b[1]:a};b._parseResponse=function(a){var b=new Sys.Data._OpenDataBatchReader(a.get_responseData(),Sys.Data._OpenDataBatchReader._boundaryFromTypeHeader(a.getResponseHeader(f)));return b.get_responses()};b._statusRegExp=new RegExp("^HTTP\\/1\\.[01] (\\d{3}) (.*)$","i");b.registerClass("Sys.Data._OpenDataBatchReader");b=Sys.Data._OpenDataBatchWriter=function(c){var b=this;b._host=c;b._content=d;b._boundary=a;b._changesetBoundary=a;b._changesetEntries=a;b._contentType=h};b.prototype={get_contentType:function(){return this._contentType},set_contentType:function(a){this._contentType=a},get_requestBody:function(){return this._content+i+this.get_topBoundary()+i},get_topBoundary:function(){var a=this;if(!a._boundary)a._boundary="batch_"+a._createBoundary();return a._boundary},addChange:function(b,e,c,d,a){this._changesetEntries.push({uri:b,eTag:e,method:c,body:d,contentId:a})},addQuery:function(b){this._content+=this._startPart(this.get_topBoundary(),m,b,a)+j},endChangeSet:function(){var b=this,c=d;for(var f in b._changesetEntries){var e=b._changesetEntries[f];c+=b._startPart(b._changesetBoundary,e.method,e.uri,e.eTag,e.contentId);if(e.body)c+="Content-Type: "+b._contentType+";charset=utf-8\r\n";c+=j;if(e.body)c+=e.body}if(c)c+=p+b._changesetBoundary+"--\r\n";b._content+=p+b.get_topBoundary()+"\r\nContent-Type: multipart/mixed;boundary="+b._changesetBoundary+"\r\n\r\n"+c;b._changesetBoundary=a;b._changesetEntries=a},startChangeSet:function(){this._changesetBoundary="changeset_"+this._createBoundary();this._changesetEntries=[]},_createBoundary:function(){function a(){return Math.floor((1+Math.random())*65536).toString(16).substr(1)}return a()+"-"+a()+"-"+a()},_startPart:function(d,e,f,c,b){var a=p+d+"\r\nContent-Type: application/http\r\nContent-Transfer-Encoding: binary\r\n\r\n"+e+" "+f+" HTTP/1.1\r\n";if(typeof b==="number")a+="Content-ID: "+b+j;if(c)a+="If-Match: "+c+j;a+="Host: "+this._host+"\r\nAccept: "+this.get_contentType()+"\r\nAccept-Charset: utf-8\r\n";return a}};b.registerClass("Sys.Data._OpenDataBatchWriter");b=Sys.Data.OpenDataContext=function(){var a=this;Sys.Data.OpenDataContext.initializeBase(a);a.set_getIdentityMethod(a._getIdentity);a.set_getNewIdentityMethod(a._getNewIdentity);a.set_fetchDataMethod(a._fetchOpenData);a.set_saveChangesMethod(a._saveOpenData);a.set_createEntityMethod(a._createEntity);a.set_handleSaveChangesResultsMethod(a._processResultsOpenData);a.set_getDeferredPropertyFetchOperationMethod(a._getDeferredQuery);a.set_isDeferredPropertyMethod(a._isDeferred);a._proxy=new Sys.Data.OpenDataServiceProxy};b.prototype={_entityCounter:0,_saveCounter:1,get_lastMetadata:function(){return this._metadata||a},get_serviceUri:function(){return this._proxy.get_serviceUri()},set_serviceUri:function(a){this._proxy.set_serviceUri(a)},_createEntity:function(c,b){var a={};c._createMetaData(a,b);return a},_fetchOpenData:function(e,m,b,h,j,d,g,l,k){if(b){if(typeof b!=="string")b=b.toString();var f=b.indexOf(":");if(f!==-1&&f<b.indexOf(c))m=b}function i(g,c,f,b){e._metadata=b;d&&d.apply(a,arguments)}return e._proxy.fetchData(b,h||a,a,j||a,i,g||a,l||0,k||a)},_getDeferredQuery:function(f,g,e,h){var b=a,d=g[e];if(d===a||typeof d===k||d instanceof Array){b=f.getIdentity(g);b+=b.endsWith(c)?e:c+e}else if(typeof d==="object"){b=f.getIdentity(d);if(!b)b=d.__deferred?d.__deferred.uri:a}if(!b)throw Error.invalidOperation(String.format(Sys.Data.OpenDataRes.propertyNotFound,e));return new Sys.Net.WebServiceOperation(b,h)},_isDeferred:function(d,c,b){var a=c[b];return!!(a&&typeof a==="object"&&a.__deferred)},_processResultsOpenData:function(i,d,a){if(a&&a.length===d.length)for(var c=0,j=a.length;c<j;c++){var f=d[c],b=f.item,g=a[c],h=g.get_result(),e=g.get_httpHeaders();if(b){h&&i._fixAfterSave(f,b,h);if(e.ETag&&b.__metadata)b.__metadata.etag=e.ETag}}},_getBatchReference:function(d,f,e,g){var b=d.__metadata[f];if(typeof b==="number")return e+"$"+b;else{var a=this.getIdentity(d);if(g)a=a.substr(a.lastIndexOf(c));return a}},_saveOpenData:function(b,p,u,n,q){var h="/$links/",l="saveChanges",v=b.get_serviceUri(),r=a;if(!v)n(new Sys.Net.WebServiceError(e,String.format(Sys.Res.webServiceFailedNoMsg,l)),q,l);else{var m,t,s=b._proxy,j=s.createActionSequence(),i="__batchNumber"+b._saveCounter++;s.set_timeout(b.get_saveChangesTimeout());for(m=0,t=p.length;m<t;m++){var f=p[m],k=f.item;switch(f.action){case Sys.Data.ChangeOperationType.insert:if(k){var o=b.get_items()[b.getIdentity(k)];delete k.__metadata;o.__metadata[i]=m;j.addInsertAction(k,o.__metadata.entitySet)}else j.addInsertAction({uri:b._getBatchReference(f.linkTarget,i,d)},b._getBatchReference(f.linkSource,i,c)+h+f.linkSourceField);break;case Sys.Data.ChangeOperationType.update:if(k)j.addUpdateAction(k);else if(f.linkTarget)j.addUpdateAction({uri:b._getBatchReference(f.linkTarget,i,d)},b._getBatchReference(f.linkSource,i,c)+h+f.linkSourceField);else j.addRemoveAction({__metadata:{uri:b._getBatchReference(f.linkSource,i,c)+h+f.linkSourceField}});break;case Sys.Data.ChangeOperationType.remove:if(k)j.addRemoveAction(k);else j.addRemoveAction({__metadata:{uri:b._getBatchReference(f.linkSource,i,c)+"/$links"+b._getBatchReference(f.linkTarget,i,c,g)}})}}r=j.execute(u,n,q)}return r},_createMetaData:function(b,a){b.__metadata={entitySet:a,uri:a+"(__new"+this._entityCounter+++")"}},_getNewIdentity:function(c,a,b){c._createMetaData(a,b);return a.__metadata.uri},_getIdentity:function(d,c){var b=c.__metadata;return b?b.uri||a:a}};b.registerClass("Sys.Data.OpenDataContext",Sys.Data.DataContext);Sys.registerComponent(b)}if(window.Sys&&Sys.loader)Sys.loader.registerScript("OpenData",a,b);else b()})();