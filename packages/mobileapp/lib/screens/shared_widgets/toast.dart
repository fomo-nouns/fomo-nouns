import 'dart:ui';

import 'package:bot_toast/bot_toast.dart';
import 'package:flutter/widgets.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:mobileapp/app/colors.dart';

/// Show app styled alert toast
void showAlertToast(String message) {
  BotToast.showCustomText(
    toastBuilder: (_) => ClipRect(
      child: BackdropFilter(
        filter: ImageFilter.blur(sigmaX: 2.w, sigmaY: 2.w),
        child: Container(
          decoration: BoxDecoration(
            color: AppColors.toastAlert,
            borderRadius: BorderRadius.all(Radius.circular(50.w)),
          ),
          padding: EdgeInsets.symmetric(
            vertical: 14.w,
            horizontal: 18.w,
          ),
          child: Padding(
            padding: EdgeInsets.only(bottom: 2.w),
            child: Text(
              message,
              style: TextStyle(
                color: AppColors.white,
                fontWeight: FontWeight.w700,
                fontSize: 16.sp,
              ),
            ),
          ),
        ),
      ),
    ),
    align: const Alignment(0, -0.98),
    wrapToastAnimation: (controller, cancel, Widget child) =>
        ToastAnimationWidget(
      controller: controller,
      child: child,
    ),
  );
}

/// Show app styled alert toast
void showNotificationToast(String message) {
  BotToast.showCustomText(
    toastBuilder: (_) => ClipRect(
      child: BackdropFilter(
        filter: ImageFilter.blur(sigmaX: 2.w, sigmaY: 2.w),
        child: Container(
          decoration: BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.centerLeft,
              end: Alignment.centerRight,
              colors: [
                AppColors.purple.withOpacity(0.8),
                AppColors.fuchsia.withOpacity(0.8),
              ],
            ),
            borderRadius: BorderRadius.all(Radius.circular(50.w)),
          ),
          padding: EdgeInsets.symmetric(
            vertical: 14.w,
            horizontal: 18.w,
          ),
          child: Padding(
            padding: EdgeInsets.only(bottom: 2.w),
            child: Text(
              message,
              style: TextStyle(
                color: AppColors.white,
                fontWeight: FontWeight.w700,
                fontSize: 16.sp,
              ),
            ),
          ),
        ),
      ),
    ),
    align: const Alignment(0, -0.98),
    wrapToastAnimation: (controller, cancel, Widget child) =>
        ToastAnimationWidget(
      controller: controller,
      child: child,
    ),
  );
}

class ToastAnimationWidget extends StatefulWidget {
  final AnimationController controller;
  final Widget child;

  const ToastAnimationWidget({
    Key? key,
    required this.controller,
    required this.child,
  }) : super(key: key);

  @override
  _ToastAnimationWidgetState createState() => _ToastAnimationWidgetState();
}

class _ToastAnimationWidgetState extends State<ToastAnimationWidget> {
  static final Tween<Offset> tweenOffset = Tween<Offset>(
    begin: Offset(0, -200.w),
    end: const Offset(0, 0),
  );

  late Animation<double> animation;

  @override
  void initState() {
    animation =
        CurvedAnimation(parent: widget.controller, curve: Curves.decelerate);
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      child: widget.child,
      animation: animation,
      builder: (BuildContext context, Widget? child) {
        return Transform.translate(
          offset: tweenOffset.evaluate(animation),
          child: Opacity(
            child: child!,
            opacity: animation.value,
          ),
        );
      },
    );
  }
}
