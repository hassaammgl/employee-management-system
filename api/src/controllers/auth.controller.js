import asyncHandler from "express-async-handler"
import { TokenService } from "../utils/Jwt.js"
import { AuthService } from "../services/auth.service.js"
import { ApiResponse } from "../utils/ApiResponse.js"

export const registerUser = asyncHandler(async (req, res) => {
    const { user, accessToken, refreshToken } = await AuthService.register(req.body)
    TokenService.setTokens(res, { accessToken, refreshToken })
    console.log(user);

    return ApiResponse.success(res, {
        statusCode: 201,
        message: "User Created Succesfully",
        data: user
    })
})

export const loginUser = asyncHandler(async (req, res) => {
    const { user, accessToken, refreshToken } = await AuthService.login(req.body)
    TokenService.setTokens(res, { accessToken, refreshToken })
    return ApiResponse.success(res, {
        message: "User login Succesfully",
        data: user
    })
})

export const logoutUser = asyncHandler(async (req, res) => {
    const isClear = await AuthService.logout(req.user.id)
    if (isClear) {
        TokenService.clearTokens(res)
        return ApiResponse.success(res, {
            message: "Logged out successfully"
        })
    }
})

export const getCurrentUser = asyncHandler(async (req, res) => {
    return ApiResponse.success(res, {
        message: "Current user fetched successfully",
        data: req.user,
    })
})

export const refreshTokens = asyncHandler(async (req, res) => {
    const refreshToken = req.cookies.refreshToken
    const { user, accessToken, refreshToken: newRefresh } = await AuthService.refresh(refreshToken)
    TokenService.setTokens(res, { accessToken, refreshToken: newRefresh })
    return ApiResponse.success(res, {
        message: "Tokens refreshed",
        data: user,
    })
})
