<template>
    <div>
        <nav-header></nav-header>
        <nav-bread>
            <span slot="bread">Goods</span>
        </nav-bread>
        <div class="accessory-result-page accessory-page">
            <div class="container">
                <div class="filter-nav">
                    <span class="sortby">Sort by:</span>
                    <a href="javascript:void(0)" class="default" v-bind:class="{'cur':defaultCur}" @click="initSort">Default</a>
                    <a href="javascript:void(0)" class="price" v-bind:class="{'cur':!defaultCur}"  @click="sortGoods()">Price
                        <svg-icon icon-class="arrow-down" v-show="!sortFlag"></svg-icon>
                        <svg-icon icon-class="arrow-up" v-show="sortFlag"></svg-icon>
                        <!--<svg class="icon icon-arrow-short">
                            <use xlink:href="#icon-arrow-short"></use>
                        </svg>-->
                    </a>
                    <a href="javascript:void(0)" class="filterby stopPop" @click="showFilterPop">Filter by</a>
                </div>
                <div class="accessory-result">
                    <!-- filter -->
                    <div class="filter stopPop" id="filter" v-bind:class="{'filterby-show':filterBy}">
                        <dl class="filter-price">
                            <dt>Price:</dt>
                            <dd><a href="javascript:void(0)" @click="initPrice" v-bind:class="{'cur':priceChecked === 'all'}">All</a></dd>

                            <dd v-for="(item,index) in priceFilter">
                                <a href="javascript:void(0)" @click="setPriceFilter(index,Number(item.startPrice),Number(item.endPrice))" v-bind:class="{'cur':priceChecked === index}">{{item.startPrice}} - {{item.endPrice}}</a>
                            </dd>
                        </dl>
                    </div>

                    <!-- search result accessories list -->
                    <div class="accessory-list-wrap">
                        <div class="accessory-list col-4">
                            <ul>
                                <li v-for="(item,index) in goodsList">
                                    <div class="pic">
                                        <a href="#"><img v-lazy="'/static/'+item.productImage" alt=""></a>
                                    </div>
                                    <div class="main">
                                        <div class="name">{{item.productName}}</div>
                                        <div class="price">{{item.salePrice}}</div>
                                        <div class="btn-area">
                                            <a href="javascript:;" class="btn btn--m" @click="addCart(item.productId)">加入购物车</a>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </div>

                        <div class="view-more-normal"
                             v-infinite-scroll="loadMore"
                             infinite-scroll-disabled="busy"
                             infinite-scroll-distance="50">

                            <img src="./../assets/loading-spinning-bubbles.svg" v-show="loading">
                        </div>
                        <h5 style="text-align: center;" v-show="GoodsFontEnd">To show all merchandise</h5>
                    </div>

                </div>
            </div>
        </div>

        <modal v-bind:mdShow="mdShow" v-on:close="closeModal">
            <p slot="message">
                请先登录,否则无法加入到购物车中!
            </p>
            <div slot="btnGroup">
                <a class="btn btn--m" href="javascript:;" @click="mdShow = false">关闭</a>
            </div>
        </modal>

        <modal v-bind:mdShow="mdShowCart" v-on:close="closeModal">
            <p slot="message">
                <svg class="icon-status-ok">
                    <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-status-ok"></use>
                </svg>
                <span>加入购物车成功!</span>
            </p>
            <div slot="btnGroup">
                <a class="btn btn--m" href="javascript:;" @click="mdShowCart = false">继续购物</a>
                <router-link class="btn btn--m btn--red" href="javascript:;" to="/cart">查看购物车</router-link>
            </div>
        </modal>
        <div class="md-overlay" v-show="overLayFlag" @click="closePop"></div>
        <nav-footer></nav-footer>
    </div>
</template>
<script>
    import '@/assets/css/base.css'
    import '@/assets/css/product.css'
    import NavHeader from '@/components/NavHeader.vue'
    import NavFooter from '@/components/NavFooter.vue'
    import NavBread from '@/components/NavBread.vue'
    import Modal from './../components/Modal'

    import axios from 'axios'

    export default {
        data() {
            return {
                goodsList: [],
                priceFilter: [
                    {
                        startPrice: '0.00',
                        endPrice: '500.00'
                    },
                    {
                        startPrice: '500.00',
                        endPrice: '1000.00'
                    },
                    {
                        startPrice: '1000.00',
                        endPrice: '2000.00'
                    },
                ],
                priceChecked: 'all',
                filterBy: false,
                overLayFlag: false,
                mdShow:false,
                mdShowCart:false,
                busy:false,
                loading:false,
                sortFlag:false,
                sort:2,
                GoodsFontEnd:false,
                page:1,
                pageSize:4,
                min:'',
                max:'',
                defaultCur:true,
            }
        },
        components: {
            NavHeader,
            NavFooter,
            NavBread,
            Modal
        },
        mounted: function () {
            this.getGoodsList();
        },

        methods: {
            getGoodsList() {
                /*该axios获取webpack.dev.conf.jsw文件配置的本地json数据
                axios.get("/api/appData").then((result) => {
                    var res = result.data.data;
                    this.goodsList = res.result;
                });
                */
                if(this.max){
                   this.max =  "/" + this.max;
                   this.min = "/" + this.min;
                }

                axios.get("/api/goods/"+this.page+"/"+this.pageSize+"/"+this.sort + this.min + this.max+"").then((result)=>{
                        let res = result.data.data;
                        if(res.data.count === 0 || JSON.stringify(this.goodsList) === JSON.stringify(res.data)){
                            this.GoodsFontEnd = true;
                            this.busy = true;
                        }else{
                            this.busy = false;
                        }
                        this.goodsList = res.data;
                    })
            },

            initPrice(){
                this.priceChecked = "all";
                this.max = '';
                this.min = '';
                this.getGoodsList();
            },

            setPriceFilter(index=null,min,max) {
                this.min = min;
                this.max = max;
                this.priceChecked = index;
                this.getGoodsList();
                /*axios.get("/api/goods/interval/"+min+"/"+max+"").then((result)=>{
                    this.goodsList = result.data.data;
                });*/
                this.closePop()//用于移动端点击价格移动端侧边消失
            },

            initSort(){
                this.sort = 2;
                this.getGoodsList();
                this.defaultCur = true;
            },

            sortGoods(){
                this.sortFlag = !this.sortFlag;
                if(this.sortFlag){
                    this.sort = 0;
                }else{
                    this.sort = 1;
                }
                this.getGoodsList();

                this.defaultCur = false;
            },

            closeModal(){//模态框触发父组件closeModal事件 模态框消失
                this.mdShow = false;
                this.mdShowCart = false;
            },

            showFilterPop() {
                this.filterBy = true;
                this.overLayFlag = true;
            },

            closePop() {//用于移动端点击价格移动端侧边消失
                this.filterBy = false;
                this.overLayFlag = false;
            },

            loadMore(){
                this.busy = true;
                this.loading = true;
                setTimeout(() => {
                    this.page++;
                    this.loading = false;
                    this.getGoodsList();
                }, 500);
            },

            addCart(productId){
                console.log(productId);
                let data = {
                    product_id:productId,

                };

                axios.get("/api/goods/cart/").then((result)=>{
                    console.log(result.data);
                });
                    this.mdShowCart = true;

                console.log(productId)
            },
        }
    }
</script>
