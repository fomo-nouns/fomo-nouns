import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:mobileapp/app/colors.dart';
import 'package:mobileapp/app/const_names.dart';
import 'package:mobileapp/screens/shared_widgets/helper.dart';
import 'package:rive/rive.dart';

class NotificationsSection extends StatelessWidget {
  const NotificationsSection({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return SidePadding(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          _title,
          const _Selectors(),
        ],
      ),
    );
  }

  Widget get _title => Padding(
        padding: EdgeInsets.only(bottom: 20.w),
        child: Text(
          "Notifications",
          style: TextStyle(
            fontFamily: AppFonts.londrina,
            fontSize: 36.sp,
            color: AppColors.textColor,
          ),
        ),
      );
}

class _Selectors extends StatelessWidget {
  const _Selectors({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        _Selector(
          type: "onAuctionEnd",
          text: "On auction end",
          value: false,
          onChange: (newValue) {},
        ),
        SizedBox(height: 10.h),
        _Selector(
          type: "onAuctionEnd",
          text: "5 min before end",
          value: true,
          onChange: (newValue) {},
        ),
        SizedBox(height: 10.h),
        _Selector(
          type: "onAuctionEnd",
          text: "10 min before end",
          value: true,
          onChange: (newValue) {},
        ),
      ],
    );
  }
}

class _Selector extends StatefulWidget {
  const _Selector({
    Key? key,
    this.type,
    required this.text,
    required this.value,
    required this.onChange,
  }) : super(key: key);

  final String text;
  final bool value;
  final Function(bool) onChange;
  final String? type;

  @override
  __SelectorState createState() => __SelectorState();
}

class __SelectorState extends State<_Selector> {
  /// Boolean state to control switch look and change animation
  SMIBool? _on;

  late bool _value;

  @override
  void initState() {
    _value = widget.value;
    super.initState();
  }

  void _onRiveInit(Artboard artboard) {
    final controller = _value
        ? StateMachineController.fromArtboard(artboard, 'OnSwitch')
        : StateMachineController.fromArtboard(artboard, 'OffSwitch');

    artboard.addController(controller!);
    _on = controller.findInput<bool>('On') as SMIBool;
  }

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      crossAxisAlignment: CrossAxisAlignment.center,
      children: [
        Text(
          widget.text,
          style: TextStyle(
            fontSize: 24.sp,
            color: AppColors.textColor,
            fontWeight: FontWeight.w500,
          ),
        ),
        GestureDetector(
          onTap: () {
            setState(() {
              _value = !_value;
              _on?.change(_value);
            });
          },
          child: Container(
            padding: EdgeInsets.only(
              top: 10.w,
              left: 10.w,
              bottom: 10.w,
            ),
            color: AppColors.transparent,
            height: 55.w,
            width: 85.w,
            child: RiveAnimation.asset(
              'assets/rive/switch.riv',
              animations: [''],
              onInit: _onRiveInit,
              fit: BoxFit.fitHeight,
              alignment: Alignment.centerRight,
            ),
          ),
        ),
      ],
    );
  }
}
