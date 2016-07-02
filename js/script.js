"use strict"

Vue.config.debug = true;

// 首页
let homePage = Vue.extend({
    props: ['userinfo'],
    data: function(){
        return {
            recommendedList: [],  // 推荐列表
            // yes: false,
            test: "123",
        };
    },
    ready: function (){
        // this.yes = true;
        // 推荐课程
        let _this = this;
        let uid = _this.userinfo._id || 2333;        $.ajax({
            method:"get",
            dataType:"json",
            ContentType: "Application/json",
            url:"/api/recommended/"+uid,
            error: function(msg){
                console.log(msg);
                layer.msg(msg.responseJSON.detail);
                return false;
            },
        }).done(function(msg){
            // 成功
            if(msg.status === 200){
                _this.recommendedList = msg.data;
                console.log(_this.recommendedList);
            }else{
                console.log(msg.detail);
                return false;
            }
        });
        // console.log(this.recommendedlist);
    },
    template:"#c-home",
});

// 课程列表页面
let coursePage = Vue.extend({
    props: ['userinfo'],
    data: function(){
        return {
            careerList: [],
            categoryLists: [],
            courseList: [],
            page: {
                currentPage: 1,
                career: "all",         // 当前方向
                category: "all",    // 当前分类
                countPage: 1,
            },
        };
    },
    ready: function (){
        // 获取职业方向
        let _this = this;

        // 获取页面初始化时需要的 career category 值
        this.page.career = this.$route.params.career ? this.$route.params.career : "all";
        this.page.category = this.$route.params.category ? this.$route.params.category.replace("_","/") : "all";
        $.ajax({
            method:"get",
            dataType:"json",
            ContentType: "Application/json",
            url:"/api/career",
            error: function(msg){
                layer.msg(msg.responseJSON.detail);
                console.log(msg);
                return false;
            },
        }).done(function(msg){
            // 获取职业方向成功
            if(msg.status === 200){
                _this.careerList = msg.data.list;
                // console.log(_this.careerList);
            }else{
                console.log(msg.detail);
                return false;
            }
        });
        // 获取课程分类
        $.ajax({
            method:"get",
            dataType:"json",
            ContentType: "Application/json",
            url:"/api/category/all",
            error: function(msg){
                layer.msg(msg.responseJSON.detail);
                console.log(msg);
            },
        }).done(function(msg){
            // 获取课程分类成功
            // console.log("获取课程分类");
            //
            if(msg.status === 200){
                _this.categoryLists = msg.data.list;
                // for(let i = 0; i < _this.categoryLists.length; i++){
                //     console.log(_this.categoryLists[i].category);
                // }
            }else{
                console.log(msg.detail);
            }
        });
        // 获取课程列表
        $.ajax({
            method:"get",
            dataType:"json",
            ContentType: "Application/json",
            url:"/api/course/all/all/1",
            error: function(msg){
                layer.msg(msg.responseJSON.detail);
                console.log(msg);
            },
        }).done(function(msg){
            // 获取课程列表成功
            // console.log("获取课程列表");
            if(msg.status === 200){
                _this.courseList = msg.data.list;
                _this.page.currentPage = msg.data.paging.currentPage;
                _this.page.countPage = msg.data.paging.countPage;
                // console.log(_this.courseList);
            }else{
                console.log(msg.detail);
            }
        });
    },
    methods: {
        // 课程列表上一页
        prePage: function(page){
            let _this = this;
            _this.page.currentPage --;
            if(_this.page.currentPage <= 0){
                _this.page.currentPage = 1;
            }
            let category = _this.page.category;
            category = category.replace("/","_");
            // 获取课程列表
            $.ajax({
                method:"get",
                dataType:"json",
                ContentType: "Application/json",
                url:"/api/course/"+_this.page.career+"/"+_this.page.category+"/"+_this.page.currentPage,
                error: function(msg){
                    layer.msg(msg.responseJSON.detail);
                    console.log(msg);
                },
            }).done(function(msg){
                // 获取课程列表成功
                // console.log("获取课程列表");
                //
                if(msg.status === 200){
                    _this.courseList = msg.data.list;
                    _this.page.currentPage = msg.data.paging.currentPage;
                    _this.page.countPage = msg.data.paging.countPage;
                    // console.log(_this.courseList);
                }else{
                    console.log(msg.detail);
                }
            });
        },
        // 课程列表下一页
        nextPage: function(page){
            let _this = this;
            _this.page.currentPage ++;
            if(_this.page.currentPage <= 0){
                _this.page.currentPage = 1;
            }
            let category = _this.page.category;
            category = category.replace("/","_");
            // 获取课程列表
            $.ajax({
                method:"get",
                dataType:"json",
                ContentType: "Application/json",
                url:"/api/course/"+_this.page.career+"/"+category+"/"+_this.page.currentPage,
                error: function(msg){
                    layer.msg(msg.responseJSON.detail);
                    console.log(msg);
                },
            }).done(function(msg){
                // 获取课程列表成功
                // console.log("获取课程列表");
                //
                console.log(_this.page);
                if(msg.status === 200){
                    _this.courseList = msg.data.list;
                    _this.page.currentPage = msg.data.paging.currentPage;
                    _this.page.countPage = msg.data.paging.countPage;
                }else{
                    console.log(msg.detail);
                }
            });
        },
        // 根据职业方向获取课程列表
        findByCareer: function(career){
            let _this = this;
            _this.page.career = career;
            _this.page.category = "all";
            _this.page.currentPage = 1;

            // 获取课程分类
            $.ajax({
                method:"get",
                dataType:"json",
                ContentType: "Application/json",
                url:"/api/category/"+_this.page.career,
                error: function(msg){
                    layer.msg(msg.responseJSON.detail);
                    console.log(msg);
                },
            }).done(function(msg){
                // 获取课程分类成功
                // console.log("获取课程分类");
                //
                if(msg.status === 200){
                    _this.categoryLists = msg.data.list;
                    // for(let i = 0; i < _this.categoryLists.length; i++){
                    //     console.log(_this.categoryLists[i].category);
                    // }
                }else{
                    console.log(msg.detail);
                }
            });
            // 获取课程列表
            $.ajax({
                method:"get",
                dataType:"json",
                ContentType: "Application/json",
                url:"/api/course/"+_this.page.career+"/"+_this.page.category+"/"+_this.page.currentPage,
                error: function(msg){
                    layer.msg(msg.responseJSON.detail);
                    console.log(msg);
                },
            }).done(function(msg){
                // 获取课程列表成功
                // console.log("获取课程列表");
                //
                if(msg.status === 200){
                    _this.courseList = msg.data.list;
                    _this.page.currentPage = msg.data.paging.currentPage;
                    _this.page.countPage = msg.data.paging.countPage;
                    // console.log(_this.courseList);
                }else{
                    console.log(msg.detail);
                }
            });
        },

        // 根据类别获取课程列表
        findByCategory: function(category){
            let _this = this;
            _this.page.category = category;
            category = category.replace("/","_");
            _this.page.currentPage = 1;
            // 获取课程列表
            $.ajax({
                method:"get",
                dataType:"json",
                ContentType: "Application/json",
                url:"/api/course/"+_this.page.career+"/"+category+"/"+_this.page.currentPage,
                error: function(msg){
                    layer.msg(msg.responseJSON.detail);
                    console.log(msg);
                },
            }).done(function(msg){
                // 获取课程列表成功
                // console.log("获取课程列表");
                //
                if(msg.status === 200){
                    _this.courseList = msg.data.list;
                    _this.page.currentPage = msg.data.paging.currentPage;
                    _this.page.countPage = msg.data.paging.countPage;
                    // console.log(_this.courseList);
                }else{
                    console.log(msg.detail);
                }
            });
        },
    },
    template:"#c-course",
});

// 用户播放历史页面
let historyPage = Vue.extend({
    props: ['userinfo'],
    data: function(){
        return {
            courseList: [],
            page: {
                currentPage: 1,
                countPage: 1,
            },
        };
    },
    ready: function (){
        let _this = this;
        let uid = _this.userinfo._id || "2333";
        // 获取历史课程列表
        $.ajax({
            method:"get",
            dataType:"json",
            ContentType: "Application/json",
            url:"/api/user/history/"+uid+"/1",
            error: function(msg){
                layer.msg(msg.responseJSON.detail);
                console.log(msg);
            },
        }).done(function(msg){
            // 获取课程列表成功
            // console.log("获取课程列表");
            if(msg.status === 200){
                _this.courseList = msg.data.list;
                _this.page.currentPage = msg.data.paging.currentPage;
                _this.page.countPage = msg.data.paging.countPage;
                // console.log(_this.courseList);
            }else{
                console.log(msg.detail);
            }
        });
    },
    methods: {
        // 课程列表上一页
        prePage: function(page){
            let _this = this;
            let uid = _this.userinfo._id || "2333";
            _this.page.currentPage --;
            if(_this.page.currentPage <= 0){
                _this.page.currentPage = 1;
            }
            // 获取课程列表
            $.ajax({
                method:"get",
                dataType:"json",
                ContentType: "Application/json",
                url:"/api/user/history/"+uid+"/"+_this.page.currentPage,
                error: function(msg){
                    layer.msg(msg.responseJSON.detail);
                    console.log(msg);
                },
            }).done(function(msg){
                // 获取历史列表成功
                if(msg.status === 200){
                    _this.courseList = msg.data.list;
                    _this.page.currentPage = msg.data.paging.currentPage;
                    _this.page.countPage = msg.data.paging.countPage;
                    // console.log(_this.courseList);
                }else{
                    console.log(msg.detail);
                }
            });
        },
        // 课程列表下一页
        nextPage: function(page){
            let _this = this;
            let uid = _this.userinfo._id || "2333";
            _this.page.currentPage ++;
            if(_this.page.currentPage <= 0){
                _this.page.currentPage = 1;
            }
            // 获取课程列表
            $.ajax({
                method:"get",
                dataType:"json",
                ContentType: "Application/json",
                url:"/api/user/history/"+uid+"/"+_this.page.currentPage,
                error: function(msg){
                    layer.msg(msg.responseJSON.detail);
                    console.log(msg);
                },
            }).done(function(msg){
                // 获取课程列表成功
                // console.log("获取课程列表");
                //
                console.log(_this.page);
                if(msg.status === 200){
                    _this.courseList = msg.data.list;
                    _this.page.currentPage = msg.data.paging.currentPage;
                    _this.page.countPage = msg.data.paging.countPage;
                }else{
                    console.log(msg.detail);
                }
            });
        },
    },
    template:"#c-history",
});

// 用户收藏课程页面
let collectionPage = Vue.extend({
    props: ['userinfo','collection','page'],
    data: function(){
        return {
            // courseList: [],
            // page: {
            //     currentPage: 1,
            //     countPage: 1,
            // },
        };
    },
    ready: function (){
        let _this = this;
        let uid = _this.userinfo._id || "2333";
        // 获取收藏课程列表
        $.ajax({
            method:"get",
            dataType:"json",
            ContentType: "Application/json",
            url:"/api/user/collection/"+uid+"/1",
            error: function(msg){
                layer.msg(msg.responseJSON.detail);
                console.log(msg);
            },
        }).done(function(msg){
            // 获取收藏列表成功
            // console.log("获取课程列表");
            if(msg.status === 200){
                _this.collection = msg.data.list;
                _this.page.currentPage = msg.data.paging.currentPage;
                _this.page.countPage = msg.data.paging.countPage;
            }else{
                console.log(msg.detail);
            }
        });
    },
    methods: {
        // 刪除
        delCollection: function(course_id, index){
            let _this = this;
            let cid = course_id;
            let uid = _this.userinfo._id;
            let i = index;
            $.ajax({
                method:"delete",
                dataType:"json",
                ContentType: "Application/json",
                url:"/api/user/collection/"+cid+"/"+uid,
                error: function(msg){
                    layer.msg(msg.responseJSON.detail);
                    console.log(msg);
                },
            }).done(function(msg){
                // 删除收藏的课程成功
                if(msg.status === 200){
                    layer.msg(msg.detail);
                    console.log(i);
                    _this.collection.splice(i,1);
                }else{
                    console.log(msg.detail);
                }
            });
        },
    },
    template:"#c-collection",
});

// 用户页面
// 其下包含用户信息,注册,登录三个组件/路径
let userPage = Vue.extend({
    props: ['userinfo'],
    ready: function () {

    },
    template: "#c-userPage",
});

// 播放器组件
let playerPage = Vue.extend({
    props: ['player', 'starttime', 'courseid', 'sectionid', 'userinfo', 'course', 'showplayer'],
    data: function (){
        return {
            spendtime: 0,
        };
    },
    ready: function () {
        this.showplayer = false;
        console.log(this.showplayer);
        // this.player = new EasyPlayer({'playerId':'easyPlayer2'});
        // this.player.setVideoSrc("/public/video/trailer.mp4");
    },
    methods: {
        // 退出视频播放
        cancelPlay: function (){
            let _this = this;
            this.showplayer = false;
            this.player.pause();
            window.scroll(0,0);
            // 统计学习时间
            _this.spendtime = Math.ceil(((+ new Date()) - _this.starttime) / 60000);
            // console.log(this.spendtime);

            // 若用户存在/已经登录这保存记录
            if(_this.userinfo._id){
                let history = {
                    user_id: _this.userinfo._id,
                    course_id: _this.courseid,
                    course_name: _this.course.course_name,
                    post_url: _this.course.post_url,
                    section_id: _this.sectionid,
                    spend_time: _this.spendtime,
                    career: _this.course.career,
                    category: _this.course.category,
                };
                console.log(history);
                // 上传学习记录
                $.ajax({
                    method:"post",
                    dataType:"json",
                    ContentType: "Application/json",
                    data: history,
                    url:"/api/user/history",
                    error: function(msg){
                        layer.msg(msg.responseJSON.detail);
                        console.log(msg);
                        return false;
                    },
                }).done(function(msg){
                    // 获取历史列表成功
                    if(msg.status === 200){
                        layer.msg(msg.detail);
                        // console.log(msg.detail);
                    }else{
                        console.log(msg.detail);
                        return false;
                    }
                });
            }

        },
    },
    template: "#c-player",
});

// 课程详情页面
let courseDetailsPage = Vue.extend({
    props: ['userinfo'],
    data: function(){
        return {
            course_id: this.$route.params.id,
            // course_id: "s",
            course: {},
            showplayer: true,   // 显示播放器
            player: {},         // 播放器对象
            starttime: 0,        // 开始学习时间 毫秒
            section_id: '',     // 当前播放的 section id
        };
    },
    ready: function(){
        // TODO
        console.log(this.$route.params);
        this.player = new EasyPlayer({'playerId':'easyPlayer2'});

        // 根据 id 获取课程详情
        let _this = this;
        $.ajax({
            method:"get",
            dataType:"json",
            async: false,
            ContentType: "Application/json",
            url:"/api/section/"+_this.course_id,
            error: function(msg){
                layer.msg(msg.responseJSON.detail);
                console.log(msg);
                return false;
            },
        }).done(function(msg){
            // 获取章节成功
            if(msg.status === 200){
                _this.course = msg.data;
                this.showplayer = false;
                window.scroll(0,0); // 滚回顶部
                console.log(msg.data);
            }else{
                console.log(msg.detail);
                return false;
            }
        });
    },
    methods: {
        // 根据 section_id 加载资源播放视频
        playVideo: function (section_id, video_url){
            let sid = section_id;
            // console.log("url:"+video_url);
            let url = video_url || "/public/video/trailer.mp4";
            window.scroll(0,54);
            this.showplayer = true;
            this.starttime = + new Date();
            this.section_id = sid;
            // this.player = new EasyPlayer({'playerId':'easyPlayer2'});
            // this.player.setVideoSrc("/public/video/trailer.mp4");
            this.player.setVideoSrc(url+"?wsiphost=local");
            // this.player.play();

            // window.addEventListener("load", function(){}, false);
        },
        // 加入个人收藏
        collect: function(course_id){
            let cid = course_id;
            // console.log(course_id);
            // 存储收藏记录
            let _this = this;
            if(_this.userinfo._id){
                let history = {
                    user_id: _this.userinfo._id,
                    course_id: _this.course.course.course_id,
                    course_name: _this.course.course.course_name,
                    post_url: _this.course.course.post_url,
                };
                console.log(history);
                // 上传学习记录
                $.ajax({
                    method:"post",
                    dataType:"json",
                    ContentType: "Application/json",
                    data: history,
                    url:"/api/user/collection",
                    error: function(msg){
                        layer.msg(msg.responseJSON.detail);
                        console.log(msg);
                        return false;
                    },
                }).done(function(msg){
                    // 成功
                    if(msg.status === 200){
                        layer.msg(msg.detail);
                        // console.log(msg.detail);
                    }else{
                        console.log(msg.detail);
                        return false;
                    }
                });
            }else{
                layer.msg("未登录");
            }
        },

    },
    template: "#c-courseDetailsPage",
    components: {
        'component-player': playerPage,
    },
});

// 用户信息组件
let userInfoPage = Vue.extend({
    props: ['userinfo'],
    data: function(){
        return {
            learnTime: 0,
            historyList: [],
            collectionList: [],
            recommendedList: [],
        };
    },
    ready: function(){
        let _this = this;
        // 获取近期学习记录
        if(_this.userinfo._id){
            let uid = _this.userinfo._id;
            // 统计学习时间
            $.ajax({
                method:"get",
                dataType:"json",
                ContentType: "Application/json",
                url:"/api/userinfo/learntime/"+uid,
                error: function(msg){
                    layer.msg(msg.responseJSON.detail);
                    console.log(msg);
                },
            }).done(function(msg){
                if(msg.status === 200){
                    _this.learnTime = msg.data.learntime;
                }else{
                    console.log(msg.detail);
                }
            });
            // 获取历史课程列表
            $.ajax({
                method:"get",
                dataType:"json",
                ContentType: "Application/json",
                url:"/api/user/history/"+uid+"/1",
                error: function(msg){
                    layer.msg(msg.responseJSON.detail);
                    console.log(msg);
                },
            }).done(function(msg){
                if(msg.status === 200){
                    _this.historyList = msg.data.list;
                    _this.historyList.splice(3);
                }else{
                    console.log(msg.detail);
                }
            });
            // 获取推荐
            $.ajax({
                method:"get",
                dataType:"json",
                ContentType: "Application/json",
                url:"/api/recommended/"+uid,
                error: function(msg){
                    console.log(msg);
                    layer.msg(msg.responseJSON.detail);
                    return false;
                },
            }).done(function(msg){
                // 成功
                if(msg.status === 200){
                    _this.recommendedList = msg.data;
                    _this.recommendedList.splice(3);
                }else{
                    console.log(msg.detail);
                    return false;
                }
            });
            // 个人收藏
            $.ajax({
                method:"get",
                dataType:"json",
                ContentType: "Application/json",
                url:"/api/user/collection/"+uid+"/1",
                error: function(msg){
                    layer.msg(msg.responseJSON.detail);
                    console.log(msg);
                },
            }).done(function(msg){
                // 获取收藏列表成功
                // console.log("获取课程列表");
                if(msg.status === 200){
                    _this.collectionList = msg.data.list;
                    _this.collectionList.splice(3);
                }else{
                    console.log(msg.detail);
                }
            });
        }else{
            layer.msg("未登录");
        }

    },
    template: "#c-userInfoPage",
});
// 用户注册组件
let userSignUpPage = Vue.extend({
    props: ['userinfo'],
    data: function(){
        return {
            user: {
                email: "",
                password: "",
                name: "",
            },
        };
    },
    ready: function(){
        console.log("signup");
    },
    methods: {
        signUp: function(){
            let user = {};
            user.email = this.user.email;
            user.password = this.user.password;
            user.name = this.user.name;
            console.log(user);
            // fetch("/api/user",{
            //     method:"POST",
            //     header: {
            //         'Accept': "Application/json",
            //         'Content-Type': "Application/json",
            //     },
            //     credentials: "same-origin",
            //     body: JSON.stringify(user),
            // }).then(function(msg) {
            //     if(msg.status == 200){
            //
            //     }else{
            //         layer.msg(msg.status);
            //     }
            // }).catch(function(ex) {
            //     console.log('parsing failed'+ex);
            // })
            $.ajax({
                method:"post",
                data:user,
                // data:JSON.stringify(user),
                dataType:"json",
                ContentType: "Application/json",
                url:"/api/user",
                error: function(msg){
                    layer.msg(JSON.stringify(msg.responseJSON.data));
                    return false;
                },
            }).done(function(msg){
                if(msg.status === 200){
                    layer.msg(msg.detail);
                    return msg.result;
                }else{
                    // showAjaxMsg(msg);
                    layer.msg(msg.detail);
                    return false;
                }
            });
        },

    },
    template: "#c-userSignUpPage",
});
// 用户登录组件
let userSignInPage = Vue.extend({
    props: ['userinfo'],
    data: function(){
        return {
            user: {
                email: "",
                password: "",
            },
        };
    },
    ready: function(){
        console.log(this.msg);
    },
    methods: {
        signIn: function(){
            let user = {};
            let _this = this;
            user.email = this.user.email;
            user.password = this.user.password;
            $.ajax({
                method:"post",
                data:user,
                dataType:"json",
                ContentType: "Application/json",
                url:"/api/authentication",
                error: function(msg){
                    layer.msg(msg.responseJSON.detail);
                    console.log(msg);
                    return false;
                },
            }).done(function(msg){
                // 登陆成功
                if(msg.status === 200){
                    layer.msg(msg.detail);
                    console.log(msg);
                    _this.userinfo = msg.data;
                    router.go({
                        name:'course',
                        params: {
                            career: 'all',
                            category: 'all',
                        },
                    });
                    console.log(_this.userinfo);
                    return msg.result;
                }else{
                    // showAjaxMsg(msg);
                    layer.msg(msg.detail);
                    return false;
                }
            });
        },
    },
    template: "#c-userSignInPage",
});


let app = Vue.extend({
    data: function(){
        return {
           projectName: "「〇'」",//α
           showCollection: false,
           keyWords: "",
           userinfo: {},
           searchList: [],  // 关键词查询结果
           collectionList: [],  // 用户收藏列表
           collectionListPage: {
               currentPage: 1,
               countPage: 1,
           },
       }
    },
    ready: function(){
        // 查询 session 保持链接
        // 刷新不掉线
        let _this = this;
        $.ajax({
            method:"get",
            dataType:"json",
            ContentType: "Application/json",
            url:"/api/authentication/keepinline/",
            error: function(msg){
                console.log(msg);
                layer.msg(msg.responseJSON.detail);
                return false;
            },
        }).done(function(msg){
            // 成功
            if(msg.status === 200){
                _this.userinfo = msg.data;
                // console.log(msg.data);
            }else{
                layer.msg("未登录哦");
                console.log(msg.detail);
                return false;
            }
        });

    },
    methods: {
        // 显示收藏列表模块
        showCollections: function(){
            let show = document.querySelector("#showCollections");
            let self = show.querySelector("input[type=checkbox]:checked");
            console.log(self);
            // console.log("asd");
            if(self){
                this.showCollection = true;
                let _this = this;
                let uid = _this.userinfo._id || "2333";
                // 获取收藏课程列表
                $.ajax({
                    method:"get",
                    dataType:"json",
                    ContentType: "Application/json",
                    url:"/api/user/collection/"+uid+"/1",
                    error: function(msg){
                        layer.msg(msg.responseJSON.detail);
                        console.log(msg);
                    },
                }).done(function(msg){
                    // 获取收藏课程列表成功
                    // console.log("获取收藏课程列表");
                    if(msg.status === 200){
                        _this.collectionList = msg.data.list;
                        _this.collectionListPage.currentPage = msg.data.paging.currentPage;
                        _this.collectionListPage.countPage = msg.data.paging.countPage;
                        // console.log(_this.collection);
                    }else{
                        layer.msg(msg.detail);
                    }
                });
            }else{
                // console.log("off");
                this.showCollection = false;
            }
            window.scroll(0,0);
        },

        // 关键词变化时查询课程
        showSearchList: function(){
            let _this = this;
            let kw = _this.keyWords;
            kw = kw.replace("/","_");

            $.ajax({
                method:"get",
                dataType:"json",
                ContentType: "Application/json",
                url:"/api/course/search/" + kw,
                error: function(msg){
                    // layer.msg(msg.responseJSON.detail);
                    console.log(msg);
                    return false;
                },
            }).done(function(msg){
                // 获取课程方向成功
                if(msg.status === 200){
                    _this.searchList = msg.data;
                    console.log(msg.data);
                }else{
                    console.log(msg.detail);
                    return false;
                }
            });
        },

        // 跳转到课程详情页面
        goToDetailsPage: function (course_id){
            let sid = course_id;
            router.go({
                name: 'courseDetails',
                params: sid,
            });
            // window.location.reload();
            console.log("reload");
        },

        // 用户注销
        logout: function(user_id){
            let _this = this;
            $.ajax({
                method:"delete",
                data: _this.userinfo,
                dataType:"json",
                ContentType: "Application/json",
                url:"/api/authentication",
                error: function(msg){
                    console.log(msg);
                    return false;
                },
            }).done(function(msg){
                if(msg.status === 200){
                    _this.userinfo = null;
                    layer.msg("已注销");
                }else{
                    console.log(msg.detail);
                    return false;
                }
            });
        },
    },
    components: {
        'component-collection': collectionPage,
    },
});

let router = new VueRouter();

router.map({
    "/": {
        name: "home",
        component: homePage,
    },
    "/course/:career/:category": {
        name: "course",
        component: coursePage,
    },
    "/course/": {
        name: "course",
        component: coursePage,
    },
    "/history": {
        name: "history",
        component: historyPage,
    },
    "/collection": {
        name: "collection",
        component: collectionPage,
    },
    // 用户页面
    "/user": {
        name: "user",
        component: userPage,
        subRoutes: {
            // 用户信息页面
            "/info": {
                name: "info",
                component: userInfoPage,
            },
            "/signin": {
                name: "signin",
                component: userSignInPage,
            },
            "/signup": {
                name: "signup",
                component: userSignUpPage,
            }
        },
    },
    "/courseDetails/:id": {
        name: "courseDetails",
        component: courseDetailsPage,
    },
});

router.start(app, "#app");

/**
 * navbar scroll response
 *
 */
let preScrollOffset = 0;
window.addEventListener("scroll", function(){
    let nav = document.querySelector("#app > .header");
    let offset = window.pageYOffset;
    let top = 44;   // navbar top 初始值
    let padding = "0 4.5%";
    let y = 0;
    let x = '0';
    // if((offset - preScrollOffset) >= 0){
    //     y = offset >= top ? top : offset;
    // }else{
    //     y = top;
    // }
    if(offset >= top){
        y = 0;
        x = 0;
    }else{
        y = top;
        x = padding;
    }
    nav.style.top = y + "px";
    nav.style.padding = x;
    preScrollOffset = offset;
    // console.log(top);
},false);


/**
 * check E-mail string
 *
 * @param   <String> email
 * @returns <Boolean>
 */
let isEmail = function (str){
    var reg = /^([a-zA-Z0-9_]{3,15})+@([a-zA-Z0-9]{2,10})+(\.([a-zA-Z0-9]{2,4}))$/;
    return reg.test(str);
}
