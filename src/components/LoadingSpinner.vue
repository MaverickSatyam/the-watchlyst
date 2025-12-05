<template>
    <div class="spinner">
        <div class="lds-dual-ring"></div>
    </div>
</template>

<style scoped>
.spinner {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 10;
}
.lds-dual-ring {
    width: 80px;
    height: 80px;
    border: 8px;
    border-top: 8px solid #3498db;
    border-radius: 50%;
    animation: lds-dual-ring 1.2s linear infinite;
}
@keyframes lds-dual-ring {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
        
    }
}
</style>