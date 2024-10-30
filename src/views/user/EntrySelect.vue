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
    justify-content: space-around; /* 在卡片之间均匀分布空隙 */
    align-items: center;
    width: 100%;
    margin-top: 80px;
    margin-left: auto;
    margin-right: auto;
    background-color: transparent;
    gap: 20px; /* 减少卡片之间的间距 */
}

@media (min-width: 1200px) {
    .card-container {
        width: 90%;
    }
}

/* 设置每个卡片的样式 */
.card1, .card2, .card3, .card4 {
    flex: 1;
    min-width: 200px;
    max-width: 280px;
    height: 400px;
    border-radius: 15px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    cursor: pointer;
}

.card1 { background: linear-gradient(135deg, #ff9a9e, #fecfef); }
.card2 { background: linear-gradient(135deg, #a8e6cf, #dcedc1); }
.card3 { background: linear-gradient(135deg, #6a9bd0, #85e3ff); }
.card4 { background: linear-gradient(135deg, #f9d256, #f9f586); }


.icon {
    width: 100px;
    height: 100px;
    background-color: white;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
}

.icon-img {
    width: 40px;
    height: 40px;
}

.text {
    margin-top: 20px;
    font-size: 2em; 
    color: white;
}

.footer {
    color: #666;
    font-size: 14px;
    position: absolute;
    bottom: 20px;
    width: 100%;
}

</style>