<template>
    <div id="app" class="main-container">
        <header class="header">
            <!-- <h1>黄冈市农民工保证金智慧管理服务平台</h1> -->
        </header>
        <div class="card-container">
            <div class="card1" @click="goToLogin">
                <div class="icon">
                    <img src="@/assets/renshe.png" alt="icon" class="icon-img" />
                </div>
                <div class="text">人社入口</div>
            </div>
            <div class="card2" @click="goToLogin">
                <div class="icon">
                    <img src="@/assets/qiye.png" alt="icon" class="icon-img" />
                </div>
                <div class="text">企业入口</div>
            </div>
            <div class="card3" @click="goToLogin">
                <div class="icon">
                    <img src="@/assets/hangye.png" alt="icon" class="icon-img" />
                </div>
                <div class="text">行业主管</div>
            </div>
            <div class="card4" @click="goToLogin">
                <div class="icon">
                    <img src="@/assets/yinhang.png" alt="icon" class="icon-img" />
                </div>
                <div class="text">银行入口</div>
            </div>
        </div>

    </div>
</template>

<script>
export default {
    methods: {
        goToLogin() {
            this.$router.push('/user/login');
        }
    }
}
</script>

<style scoped>
.header h1 {
    color: #333;
    padding: 20px;
}

.main-content {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 70vh;
}

.card-container {
    display: flex;
    /* 使用Flexbox进行布局 */
    justify-content: space-between;
    /* 在行内均匀分布 */
    align-items: center; 
    /* 垂直居中 */
    width: 100%;
    /* 设置容器宽度 */
    padding: 20px;
    /* 添加一些内边距 */
    margin-top: 100px;
    background-color: transparent;
}

.card1 {
    width: 350px;
    /* 宽度 */
    height: 450px;
    /* 高度 */
    background: linear-gradient(135deg, #ff9a9e, #fecfef);
    /* 渐变背景颜色 */
    border-radius: 15px;
    /* 圆角 */
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    /* 阴影效果 */
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    cursor: pointer;
}

.card2 {
    width: 350px;
    /* 宽度 */
    height: 450px;
    /* 高度 */
    background: linear-gradient(135deg, #a8e6cf, #dcedc1);
    /* 渐变背景颜色 */
    border-radius: 15px;
    /* 圆角 */
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    /* 阴影效果 */
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    cursor: pointer;
}

.card3 {
    width: 350px;
    /* 宽度 */
    height: 450px;
    /* 高度 */
    background: linear-gradient(135deg, #6a9bd0, #85e3ff);
    /* 渐变背景颜色 */
    border-radius: 15px;
    /* 圆角 */
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    /* 阴影效果 */
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    cursor: pointer;
}

.card4 {
    width: 350px;
    /* 宽度 */
    height: 450px;
    /* 高度 */
    background: linear-gradient(135deg, #f9d256, #f9f586);
    /* 渐变背景颜色 */
    border-radius: 15px;
    /* 圆角 */
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    /* 阴影效果 */
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    cursor: pointer;
}

.icon {
    width: 100px;
    /* 图标大小 */
    height: 100px;
    background-color: white;
    /* 图标背景为白色 */
    border-radius: 50%;
    /* 圆形图标背景 */
    display: flex;
    justify-content: center;
    align-items: center;
}

.icon-img {
    width: 40px;
    /* 图片的宽度 */
    height: 40px;
    /* 图片的高度 */
}

.text {
    margin-top: 25px;
    font-size: 35px;
    color: white;
    /* 字体颜色 */
}

.footer {
    color: #666;
    font-size: 14px;
    position: absolute;
    bottom: 20px;
    width: 100%;
}
</style>