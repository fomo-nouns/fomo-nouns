import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:mobileapp/app/colors.dart';
import 'package:mobileapp/screens/shared_widgets/helper.dart';

class VoteBar extends StatefulWidget {
  const VoteBar({Key? key}) : super(key: key);

  @override
  _VoteBarState createState() => _VoteBarState();
}

class _VoteBarState extends State<VoteBar> {
  @override
  Widget build(BuildContext context) {
    return SidePadding(
        child: Container(
      decoration: BoxDecoration(
        color: Theme.of(context).backgroundColor,
        borderRadius: BorderRadius.all(Radius.circular(20.w)),
        boxShadow: [
          BoxShadow(
            color: AppColors.black.withOpacity(0.15),
            offset: Offset(0.0, 4.h),
            blurRadius: 4.w,
          )
        ],
      ),
      child: Row(
        children: [
          VoteButton(
            text: "👎",
            numberOfVotes: 2,
            onClick: () {},
          ),
          VoteButton(
            text: "👍",
            numberOfVotes: 16,
            onClick: () {},
          )
        ],
      ),
    ));
  }
}

class VoteButton extends StatefulWidget {
  const VoteButton({
    Key? key,
    required this.text,
    required this.numberOfVotes,
    required this.onClick,
  }) : super(key: key);

  final String text;
  final int numberOfVotes;
  final Function onClick;

  @override
  _VoteButtonState createState() => _VoteButtonState();
}

class _VoteButtonState extends State<VoteButton> {
  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: Padding(
        padding: EdgeInsets.all(10.w),
        child: Container(
          decoration: BoxDecoration(
            color: AppColors.white,
            borderRadius: BorderRadius.all(Radius.circular(20.w)),
            boxShadow: [
              BoxShadow(
                color: AppColors.black.withOpacity(0.25),
                offset: Offset(0.0, 2.h),
                blurRadius: 4.w,
              )
            ],
          ),
          height: 95.h,
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text(
                widget.text,
                style: TextStyle(
                  fontSize: 42.sp,
                ),
              ),
              Text(
                widget.numberOfVotes.toString(),
                style: TextStyle(
                  fontSize: 24.sp,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
