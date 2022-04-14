import 'package:flutter/widgets.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:mobileapp/app/colors.dart';
import 'package:mobileapp/app/const_names.dart';

class FlatTextButton extends StatelessWidget {
  const FlatTextButton({
    Key? key,
    required this.text,
    required this.onTap,
  }) : super(key: key);

  final String text;
  final Function() onTap;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        decoration: BoxDecoration(
          color: AppColors.white.withOpacity(0.25),
          borderRadius: BorderRadius.all(Radius.circular(20.w)),
        ),
        padding: EdgeInsets.only(
          top: 12.w,
          bottom: 12.w,
          left: 18.w,
          right: 18.w,
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            Text(
              text,
              style: TextStyle(
                fontSize: 19.sp,
                fontWeight: FontWeight.w700,
                color: AppColors.greyTwo,
              ),
            ),
            SvgPicture.asset(SvgPaths.arrowRight),
          ],
        ),
      ),
    );
  }
}
